"user strict";
const util = require("util");
var mysql_npm = require("mysql");
const { mysql } = require("../config/vars");
var db_config = {
  host: mysql.host,
  user: mysql.username,
  password: mysql.password,
  database: mysql.database,
  queueLimit: 0,
  port: mysql.port,
  waitForConnection: true,
};

mysql_npm.createConnection({ multipleStatements: true });
const pool = mysql_npm.createPool(db_config);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }

  if (connection) connection.release();

  return;
});

pool.query = util.promisify(pool.query);
module.exports = pool;
