const db = require("../db/connection");

exports.checkReviewIdExists = async (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((queryOutput) => {
      if (queryOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review ID not found" });
      }
    });
};
