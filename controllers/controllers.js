const {
  fetchCategories,
  fetchReviews,
  fetchReviewsById,
  fetchReviewCommentsById,
  insertCommentsByReviewId,
  fetchUsers,
  removeCommentByID,
  updateReviewVotes,
} = require("../models/models");

const endPoints = require('../endpoints.json');


const endPoints = require('../endpoints.json');

exports.getEndpoints = (req, res, next) => {
  
  res.send({ endPoints })
  
  };

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
  const { category, order, sort_by } = req.query;

  fetchReviews(category, order, sort_by)
    .then((reviews) => {
      res.send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
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



exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const votes = req.body;

  updateReviewVotes(review_id, votes)
    .then((review) => {
      res.status(202).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentByID(comment_id)
    .then(() => {
      res.status(204).send();
    })

    .catch((err) => {
      next(err);
    });
};
