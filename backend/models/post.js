const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize'); 
const User = require('./user');
const Comment = require('./comment');


const Post = sequelize.define('Post', {
  post_id: {
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
  comment_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Comment,
      key: 'comment_id',
    },
  },
  postingDate: {
    type: DataTypes.DATE,
  },
  textContent: {
    type: DataTypes.TEXT,
  },
  mltMediaContent: {
    type: DataTypes.STRING(255),
  },
  likes: {
    type: DataTypes.INTEGER,
  },
  dislikes: {
    type: DataTypes.INTEGER,
  },
});

Post.belongsTo(User, { foreignKey: 'user_id' });
Post.belongsTo(Comment, { foreignKey: 'comment_id' });

module.exports = Post;
