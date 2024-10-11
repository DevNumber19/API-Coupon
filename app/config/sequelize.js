'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../configs/db.config.json')[env];
const db = {};
const { mysql} = require('./vars');
const dbConfig = mysql;

let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);

// }

sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);




require('../models')(sequelize, Sequelize, db);

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     console.log('file: ', file);
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const pathFile = path.join(__dirname, file);
//     console.log('pathFile: ', pathFile);
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize);
//     // console.log('model name: ', model.name);
//     db[model.name] = model;
//   });

Object.keys(db).forEach((modelName) => {

  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
