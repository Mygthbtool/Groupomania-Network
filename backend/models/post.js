const mongoose = require('mongoose');

const postSchema = mongoose.Schema ({
    userFirstName: { type: String, required: true  },
    userLastName: { type: String, required: true  },
    userAvatar: { type: String, required: true  },
    postingDate: { type: String, required: true  },
    textContent: { type: String},
    multiMediaContent: { type: String},
    likes: { type: Number },
    dislikes: { type: Number },
    comments: { type: String },
    usersLiked: { type: [ "String <userId>" ]  },
    usersDisliked: { type: [ "String <userId>" ]  },
    userId: { type: String, required: true  }
  });

  module.exports = mongoose.model('Post', postSchema);