const mysql = require("mysql");
require("dotenv").config();
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.PASSWORD,
  database: "emptrack_db",
});

connection.connect();
connection.query = util.promisify(connection.query);

module.exports = connection;