const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model }
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { collection: 'comments' });

module.exports = mongoose.model('Comment', commentSchema);