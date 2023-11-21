const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize'); 
const User = require('./user');
const Post = require('./post');

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'posts',
      key: 'post_id',
    },
  },
  text: {
    type: DataTypes.TEXT,
  },
});


module.exports = Comment;

Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

