const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('groupomania', 'root', 'AnaCoderChelfi', {
  host: 'localhost',
  dialect: 'mysql',
  "define": {
    "timestamps": false
  }
});

module.exports = sequelize;
