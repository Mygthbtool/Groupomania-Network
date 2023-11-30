const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

exports.createComment = (req, res, next) => {
  console.log(req.body);

  const newComment = Comment.build({
    user_id: req.body.userId,
    text: req.body.text,
    post_id: req.body.postId
  });

  newComment.save().then((comment) => {
    Post.findByPk(req.body.postId).then((post) => {
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      post.getComments().then((comment_id) => {
        // Check if post.comments is null, and initialize it as an empty array if necessary
        if (!comment_id) {
          comment_id = [];
        }

        // Push the new comment to the post.comments array
        comment_id.push(comment);

        post.setComments(comment_id);

        // Save the post
        post
          .save()
          .then(() => {
            res.status(201).json(comment);
          })
          .catch((error) => {
            console.error('Error saving post:', error);
            res.status(500).json({ error: error });
          });
      });
    });
  }).catch((error) => {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: error });
  });
};
