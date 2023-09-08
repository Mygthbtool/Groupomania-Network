const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    userFirstName: { type: String },
    userLastName: { type: String },
    userAvatar: { type: Object },
    postingDate: { type: String  },
    textContent: { type: String},
    mltMediaContent: { type: String},
    likes: { type: Number },
    dislikes: { type: Number },
    comments: { type: Array },
    userId: { type: String }
  });

  module.exports = mongoose.model('Post', postSchema);
