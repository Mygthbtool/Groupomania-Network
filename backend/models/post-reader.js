const { DataTypes } = require('sequelize');
const User = require('./user');
const Post = require('./post');

const sequelize = require('../sequelize'); 

const PostReader = sequelize.define('PostReader', {
  reader_id: {
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
  
});

PostReader.belongsTo(User, { foreignKey: 'user_id' });
PostReader.belongsTo(Post, { foreignKey: 'post_id' });

module.exports = PostReader;
