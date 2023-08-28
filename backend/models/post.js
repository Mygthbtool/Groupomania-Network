const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    userFirstName: { type: String, required: true  },
    userLastName: { type: String, required: true  },
    userAvatar: { type: String, required: true  },
    postingDate: { type: String, required: true  },
    textContent: { type: String},
    mltMediaContent: { type: String},
    likes: { type: Number },
    dislikes: { type: Number },
    comments: { type: Array },
    userId: { type: String, required: true  }
  });

  module.exports = mongoose.model('Post', postSchema);