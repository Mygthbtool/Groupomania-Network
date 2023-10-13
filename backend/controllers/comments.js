const Comment = require('../models/comment');
const Post = require('../models/post')

//create new comment
exports.createComment = (req, res, next) => {
  console.log(req.body);
const newComment = new Comment({
   userId: req.body.userId,
   text: req.body.text,
   postId: req.body.postId  
});

newComment.save()
  .then((comment) => {
    Post.findOne({_id: req.body.postId}).populate("userId")
  
    .then((post) => {
      post.comments.push(comment);
      post.save().then(() => {res.status(201).json(comment)})
    })
  
    console.log('Comment saved');
  })
  .catch((error) => {
    console.error('Error saving comment:', error);
  });
}

//Get Comments For a post
exports.getCommentsForPost = (req, res, next) => {

//  const postId = req.params.postId; // Get the post ID from the URL parameter
  Comment.find({})
  // .populate('comments')
  .populate('userId')
  .then((comments) => {
      res.status(200).json(comments);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
