const {fetchCategories, fetchReviews, fetchReviewsById,fetchReviewCommentsById,insertCommentsByReviewId} = require('../models/models')



exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};


exports.getReviews = (req, res, next) => {
  fetchReviews()
  .then((reviews) => {
    res.send({ reviews });
  })
  .catch((err) => {
    next(err);
  })
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsById(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch((err) => {
      next(err);
    });
};


exports.getReviewCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewCommentsById(review_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};


//task 7

exports.postCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  const commentBody = req.body;

  insertCommentsByReviewId(review_id, commentBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};



