const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    postingDate: { type: String  },
    textContent: { type: String },
    mltMediaContent: { type: String },
    likes: { type: Number },
    dislikes: { type: Number },
    comments:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model }
    readBy: [{ type: mongoose.Schema.Types.ObjectId }],
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId }],
    usersDisliked: [{ type: mongoose.Schema.Types.ObjectId }]

  });

  module.exports = mongoose.model('Post', postSchema);
  