const db = require('../db/connection') 
const format = require("pg-format")

exports.fetchCategories = ()=>{

    return db.query(`
        SELECT slug, description FROM categories;
    `).then((result)=>{
        return result.rows
    })

}