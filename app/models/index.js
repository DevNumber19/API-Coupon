
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

module.exports = (sequelize, Sequelize, db) => {

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const pathFile = path.join(__dirname, file);
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });
}