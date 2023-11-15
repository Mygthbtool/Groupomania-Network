const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
   allowNull: false, // Adding 'allowNull' as an example; adjust as needed
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false, // Adding 'allowNull' as an example; adjust as needed
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
   allowNull: false, // Adding 'allowNull' as an example; adjust as needed
  },
  password: {
    type: DataTypes.STRING,
   allowNull: false, // Adding 'allowNull' as an example; adjust as needed
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true, // Adjust 'allowNull' as per your requirements
  },
});

module.exports = User;
