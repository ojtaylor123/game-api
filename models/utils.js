const db = require("../db/connection");

exports.checkReviewIdExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((queryOutput) => {
      if (queryOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review ID not found" });
      }
    });
};

//task 7
exports.checkUserExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((queryOutput) => {
      if (queryOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
    });
};
