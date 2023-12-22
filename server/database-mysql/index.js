var mysql = require("mysql2");
const dotenv = require("dotenv");
const PoolManager  = require("mysql-connection-pool-manager")
dotenv.config();

var connection = mysql.createPool({
  connectionLimit : process.env.CONNECTIONLIMIT || 100,
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Yaya2410",
  database: process.env.MYSQL_DATABASE || "almakteb",
  charset: "cp1256",
  port : process.env.DB_PORT || 3306
});

connection.getConnection((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log("My SQL Database Connected..");
  }
});
module.exports = connection;
