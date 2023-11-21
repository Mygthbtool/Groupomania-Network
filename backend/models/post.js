const { DataTypes } = require('sequelize');

const sequelize = require('../sequelize'); 
const User = require('./user');


const Post = sequelize.define('Post', {
  post_id: {
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
  comment_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'comments',
      key: 'comment_id',
    },
  },
  posting_date: {
    type: DataTypes.DATE,
  },
  text_content: {
    type: DataTypes.TEXT,
  },
  mlt_media_content: {
    type: DataTypes.STRING(255),
  },
  likes: {
    type: DataTypes.INTEGER,
  },
  dislikes: {
    type: DataTypes.INTEGER,
  },
});

Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


module.exports = Post;

const Comment = require('./comment');

Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments'});


