const db = require('../db/connection') 
const format = require("pg-format")

exports.fetchCategories = ()=>{

    return db.query(`
        SELECT slug, description FROM categories;
    `).then((result)=>{
        return result.rows
    })

}

exports.fetchReviews= () => {

    return db.query(`

    SELECT owner, title,reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
    `).then((result) => {
        return result.rows;
      });
}