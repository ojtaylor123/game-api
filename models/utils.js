const db = require("../db/connection");

exports.checkExists = (table, column, item) => {
  const queryString = `SELECT * FROM ${table} WHERE ${column} = $1`;

  console.log(queryString);
  return db.query(queryString, [item]).then((queryOutput) => {
    if (queryOutput.rows.length === 0) {
      let message = "review ID not found";
      if (table === "users") {
        message = "username does not exist";
      }
      return Promise.reject({ status: 404, msg: message });
    }
  });
};
