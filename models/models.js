const db = require("../db/connection");
const format = require("pg-format");
const { checkReviewIdExists, checkUserExists } = require("./utils");

exports.fetchCategories = () => {
  return db
    .query(
      `
        SELECT slug, description FROM categories;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `

    SELECT owner, title,reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchReviewsById = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid query review ID must be int",
    });
  }

  return db
    .query(
      `
    SELECT *
    FROM reviews
    WHERE review_id = $1;  
    `,
      [review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review ID not found" });
      } else {
        return review.rows;
      }
    });
};

exports.fetchReviewCommentsById = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid query review ID must be int",
    });
  }

  return checkReviewIdExists(review_id)
    .then(() => {
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, review_id FROM
      comments
      WHERE review_id = $1
      ORDER BY created_at DESC;
      
      `,
        [review_id]
      );
    })
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review ID found but no comments attatched",
        });
      }
      return comments.rows;
    });
};
//task 7
exports.insertCommentsByReviewId = (review_id, commentBody) => {
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      msg: "bad request review_id should be a number",
    });
  }

  return checkReviewIdExists(review_id)
    .then(() => {
      if (!commentBody.username && !commentBody.body) {
        return Promise.reject({
          status: 400,
          msg: "bad request body should contain an object with the following elements: username, body",
        });
      }
    })
    .then(() => {
      return checkUserExists(commentBody.username);
    })
    .then(() => {
      const queryText = `INSERT INTO comments (body, author,review_id) VALUES ('${commentBody.body}', '${commentBody.username}', ${review_id}) RETURNING *; `;

      return db.query(queryText);
    })
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateReviewVotes = (review_id, votes) => {

  if(isNaN(review_id)){
    return Promise.reject({
      status: 400,
      msg: "review ID must be an integer",
    });

  }
    
      if (!votes.inc_votes) {
        return Promise.reject({
          status: 400,
          msg: "bad request body should contain an object with the following element: inc_votes",
        });
      }

      if (isNaN(votes.inc_votes)) {
        return Promise.reject({
          status: 400,
          msg: "inc votes must be of type: integer",
        });
      }
  
      return db.query(
        `UPDATE reviews Set votes = votes + $1 WHERE review_id = $2 RETURNING*`,
        [votes.inc_votes, review_id]
      )
    .then((review)=>{

      if(review.rows.length === 0){
        return Promise.reject({status: 404, msg: 'review ID not found'})
      }else{
      return review.rows[0]
      }
    })
};
