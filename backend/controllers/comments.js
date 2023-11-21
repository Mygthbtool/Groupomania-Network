const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
//create new comment
// exports.createComment = (req, res, next) => {
//   console.log(req.body);
// const newComment = new Comment({
//    userId: req.body.userId,
//    text: req.body.text,
  
// });

// newComment.save()
//   .then((comment) => {
//     Post.findOne({_id: req.body.postId}).populate('userId')
    
//     .then((post) => {
     
//       post.comments.push(comment);
//       post.save().then(() => {res.status(201).json(comment)})
     
//     })
//     .catch((error) => {
//       console.error('Error saving post:', error);
//       res.status(500).json({ error: error });
//     });
//     console.log('Comment saved');
//   })
//   .catch((error) => {
//     console.error('Error saving comment:', error);
//   });
// }

// exports.createComment = (req, res, next) => {
//   console.log(req.body);

//   const newComment = new Comment({
//     userId: req.body.userId,
//     text: req.body.text,
//   });

//   newComment.save()
//     .then((comment) => {
//       Post.findOne({ _id: req.body.postId })
//         .populate('userId')
//         .then((post) => {
//           if (post.comments === null) {
//             post.comments = []; // Initialize as an empty array if null
//           }

//           post.comments.push(comment);
//           post.save()
//             .then(() => {
//               res.status(201).json(comment);
//             })
//             .catch((error) => {
//               console.error('Error saving post:', error);
//               res.status(500).json({ error: error });
//             });
//         })
//         .catch((error) => {
//           console.error('Error fetching post:', error);
//           res.status(500).json({ error: error });
//         });

//       console.log('Comment saved');
//     })
//     .catch((error) => {
//       console.error('Error saving comment:', error);
//       res.status(500).json({ error: error });
//     });
// }

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
//Get Comments For a post
// exports.getCommentsForPost = (req, res, next) => {

//  //const postId = req.params.postId; // Get the post ID from the URL parameter
 
//   Comment.find().populate("userId")

//   .then((comments) => {
//       res.status(200).json(comments);
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// };
