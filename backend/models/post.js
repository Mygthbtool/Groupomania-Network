const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    postingDate: { type: String  },
    textContent: { type: String },
    mltMediaContent: { type: String },
    likes: { type: Number },
    dislikes: { type: Number },
    comments: { type: Array },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model }
  });

  module.exports = mongoose.model('Post', postSchema);
  