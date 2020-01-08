const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite3')
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      (file !== basename) 
      && (file.indexOf('.') !== -1)
      && (file.slice(-3) === '.js')
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync().then(() => console.log('Database synced.'))

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;