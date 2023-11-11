const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize'); 
const User = require('./user');
const Post = require('./post');

console.log(User);
console.log(Post);

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: 'post_id',
    },
  },
  text: {
    type: DataTypes.TEXT,
  },
});

Comment.belongsTo(User, { foreignKey: 'user_id' });
// Comment.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = Comment;
