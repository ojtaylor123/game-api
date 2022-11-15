const {fetchCategories, fetchReviews} = require('../models/models')



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




