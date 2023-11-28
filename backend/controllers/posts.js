const Post = require('../models/post');
const fs = require('fs');
const User = require('../models/user');
const Comment = require('../models/comment');
const PostReaction = require('../models/post-reaction');
const PostReader = require('../models/post-reader');

// Create new poste
exports.createPost = (req, res, next) => {
  const postObj = req.body;
  console.log({postObj});

  const url = req.protocol + '://' + req.get('host');
  let mltMediaContent = ''; // Initialize mltMediaContent

  // Check if a file has been uploaded
  if (req.file) {
    mltMediaContent = url + '/images/' + req.file.filename;
  }
  
  Post.create({
    user_id: postObj.userId,
    posting_date: postObj.postingDate,
    text_content: postObj.textContent,
    likes: postObj.likes,
    dislikes: postObj.dislikes,
    mlt_media_content: mltMediaContent
}).then(function (post) {
    if (post) {
      res.status(201).json({
             message: 'Post saved successfully!', post
      });
    } else {
        response.status(400).send('Error in insert new record');
    }
});
  
};

//Get one poste
exports.getOnePost = (req, res, next) => {
  Post.findOne( { where: {post_id: req.params.id },
  include: [
    { model: User, as: 'user' },  // association with 'user'
    { model: Comment, as: 'comments', include: [{model: User, as: 'user'}]}  // assuming you have an association named 'comments'
  ],
  
})
  // .populate({
  //   path: 'comments',
  //   populate: { path: 'userId' }
  // })
  // .populate("userId")
  
  .then((post) => {   
     res.status(200).json(post);
  })
  .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
  });
};

// if(!post.read_by.includes($auth.userId)){
//   post.read_by.push($auth.userId)
//   post.save().then((post) => {
//   return res.status(200).json(post)
//   })
//   return res.status(200).json(post)
// }


// Mark post as read
exports.markPostRead = async (req, res, next) => {
  
  console.log(req.body)
  const postId = req.params.id;
  const userIdentifier = req.body.userId
  try {
    const postreader = await PostReader.findOne({ where: { post_id: postId, user_id: userIdentifier }})
 
    // if (!postreader) {
    //   return res.status(404).json({ error: 'Postreader not found' });
    // }
    // Check if the user ID is not already in the 'readBy' array to avoid duplicates.
    if (!postreader) {
      PostReader.create({
        user_id: userIdentifier,
        post_id: postId
      });

    }
    // console.log(post.readBy);
    res.status(200).json({ message: 'Post marked as read', postreader });
  } catch (error) {
    console.error('Error marking post as read:', error);
    res.status(500).json({ error: 'Failed to mark post as read' });
  }
 }

//Modify post 
exports.modifyPost = (req, res, next) => {
  const postId = req.params.id;

  // Find the post first
  Post.findOne({ where: { post_id: postId } })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Optionally, delete the previous multimedia content
      if (post.mlt_media_content) {
        const filename = post.mlt_media_content.split('/images/')[1];
        fs.unlink('images/' + filename, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }

      // Update the post information
      const url = req.protocol + '://' + req.get('host');
      const updatedPost = {
        text_content: req.body.textContent,
        // Check if a file is uploaded
        mlt_media_content: req.file ? url + '/images/' + req.file.filename : null,
      };

      // Use update to modify the post
      Post.update(updatedPost, { where: { post_id: postId } })
        .then(() => {
          res.status(200).json({ message: 'Post updated successfully!' });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
}

//   console.log(req.body);
//   let post = new Post( { where: { post_id: req.params.id }});

//   if (req.file) {
//     const url = req.protocol + '://' + req.get('host');
//     post = {
//       text_content: req.body.textContent,
//       mlt_media_content: url + '/images/' + req.file.filename,
//     };
//   } else {
//     post = {
//       text_content: req.body.textContent,
//     };
//   }
//   Post.update( {where: {post_id: req.params.id}}, post)
//     .then(() => {
//       res.status(201).json({
//         message: 'Post updated successfully!'
//       });
//     }).catch(
//       (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// };

// Delete post
exports.deletePost = (req, res, next) => {
  console.log(req.params.id);

  Post.findOne({ where: {post_id: req.params.id }})
  .then((post) => {

      if(post.mlt_media_content){
       const filename = post.mlt_media_content.split('/images/')[1];
       fs.unlink('images/' + filename, (err) => {
          if(err){
            console.log(err);
          }
       })
      }  
      Post.destroy({where: {post_id: req.params.id}})
        .then((rowsDeleted) => {
          if(rowsDeleted === 1) {
            res.status(200).json({
              message: 'Deleted!'
            });
          }else {
            res.status(404).json({ message: 'Post not found' });
          }
        }).catch((error) => {
            res.status(400).json({ error: error });
          }
        );
  }).catch((error) => {
      res.status(400).json({ error: error });
    });
}


//Get all posts

exports.getAllPosts = (req, res, next) => {
  // Include the associated User and Comment models
  Post.findAll({
    include: [
      { model: User, as: 'user' },  // association named 'user'
      //{ model: Comment, as: 'comment' }  // assuming you have an association named 'comments'
    ],
   // order: [['posting-date', 'DESC']]  // sort by postingDate in descending order
  })
  .then((posts) => {
    res.status(200).json(posts);
  })
  .catch((error) => {
    res.status(400).json({
      error: error.message
    });
  });
};

// exports.getAllPosts = (req, res, next) => {
  
//   Post.find().populate('userId')
//   .populate('comments')
//   .sort({ postingDate: -1 })
//   .then((posts) => {
//       res.status(200).json(posts);
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// };

// Like and dislike Post
// exports.likeAndDislikePost = (req, res, next) => {
//   console.log(req.body.like)
//   const userIdentifier = req.body.userId;
//   const likeStatus = req.body.like;
//   const postId = req.params.id;

//   // Find the post reaction for the user and post
//   PostReaction.findOne({ where: { post_id: postId, user_id: userIdentifier } })
//     .then((postReaction) => {
//       if (postReaction) {
//         // Update the existing post reaction
//         postReaction.update({ value: likeStatus })
//           .then(() => {
//             // Handle the case when likeStatus is 0 (canceling like or dislike)
//             if (likeStatus === 0) {
//               if (postReaction.value === 1) {
//                 // User is canceling a like
//                 Post.decrement('likes', { where: { post_id: postId } })
//                   .then(() => {
//                     res.status(201).json({ message: 'Like canceled successfully!', postReaction });
//                   })
//                   .catch((error) => {
//                     res.status(500).json({ error: error });
//                   });
//               } else if (postReaction.value === -1) {
//                 // User is canceling a dislike
//                 Post.decrement('dislikes', { where: { post_id: postId } })
//                   .then(() => {
//                     res.status(201).json({ message: 'Dislike canceled successfully!', postReaction });
//                   })
//                   .catch((error) => {
//                     res.status(500).json({ error: error });
//                   });
//               }
//             } else {
//               // Update the post likes and dislikes based on the like status
//               if (likeStatus === 1) {
//                 Post.increment('likes', { where: { post_id: postId } })
//                   .then(() => {
//                     res.status(201).json({ message: 'Post liked successfully!', postReaction });
//                   })
//                   .catch((error) => {
//                     res.status(500).json({ error: error });
//                   });
//               } else if (likeStatus === -1) {
//                 Post.increment('dislikes', { where: { post_id: postId } })
//                   .then(() => {
//                     res.status(201).json({ message: 'Post disliked successfully!', postReaction });
//                   })
//                   .catch((error) => {
//                     res.status(500).json({ error: error });
//                   });
//               }
//             }
//           })
//           .catch((error) => {
//             res.status(500).json({ error: error });
//           });
//       } else {
//         // Create a new post reaction if it doesn't exist
//         PostReaction.create({
//           value: likeStatus,
//           user_id: userIdentifier,
//           post_id: postId,
//         })
//           .then(() => {
//             // Update the post likes and dislikes based on the like status
//             if (likeStatus === 1) {
//               Post.increment('likes', { where: { post_id: postId } })
//                 .then(() => {
//                   res.status(201).json({ message: 'Post liked successfully!' }, postReaction);
//                 })
//                 .catch((error) => {
//                   res.status(500).json({ error: error });
//                 });
//             } else if (likeStatus === -1) {
//               Post.increment('dislikes', { where: { post_id: postId } })
//                 .then(() => {
//                   res.status(201).json({ message: 'Post disliked successfully!', postReaction });
//                 })
//                 .catch((error) => {
//                   res.status(500).json({ error: error });
//                 });
//             }
//           })
//           .catch((error) => {
//             res.status(500).json({ error: error });
//           });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error });
//     });
// };
// ----------------------------------------------------------------------------------
    // If the user like the post, likestatus increased by 1      
//         if(likeStatus === 1) {
            
//           Post.findByIdAndUpdate({_id: req.params.id}, {$inc:{likes: +1},
//             $push:{usersLiked: userIdentifier}})
//           .then(() =>   
//             Post.findOne({_id: req.params.id})
//             .populate({
//               path: 'comments',
//               populate: { path: 'userId' }
//             })
//             .populate("userId")
            
//           .then((post) => {   
//               res.status(201).json({
//                 message: 'like has been added successfully!', post        
//                 })

//           })
//           ).catch((error) => {
//                 res.status(400).json({
//                 error: error});
//             }) 
                                      
//         }
            
//     // If the user dislike the post, likestatus decreased by 1  
//         else if (likeStatus === -1) {
        
//             Post.findByIdAndUpdate({_id: req.params.id}, {$inc:{dislikes: +1},
//               $push:{usersDisliked: userIdentifier}})
//             .populate('userId')
//             .then((post) =>   
//                 res.status(201).json({
//                 message: 'dislike has been added successfully!', post  
                    
//                 })
//             )
//             .catch((error) => {
//                 res.status(400).json({
//                 error: error});
//             })
               
//         }    
//     // If the user cancel his like or dislike
//     else if (likeStatus === 0) {       
        
//         Post.findByIdAndUpdate({_id: req.params.id}).populate('userId')
//         .then((post) => {
//           // user cancel his like
//                 if(post.usersLiked.includes(userIdentifier)){
//                   Post.updateOne({_id: req.params.id}, {$inc:{likes: -1},
//                     $pull:{usersLiked: userIdentifier}})//.populate('userId')
        
//                     .then(() => res.status(201).json({message: "Like has been canceled"}))
//                     .catch(error => res.status(400).json(error))
                    
//                 }               
//                 //user cancel his dislike
//                 else if(post.usersDisliked.includes(userIdentifier)){
//                   Post.updateOne({_id: req.params.id}, {$inc:{dislikes:-1}, 
//                      $pull:{usersDisliked: userIdentifier}})//.populate('userId')

//                     .then(() => res.status(201).json({message: "Dislike has been canceled"}))
//                     .catch(error => res.status(400).json(error))
//                 } 
                
//         }).catch(error => res.status(400).json(error))
//     } 
// }

updatePostStats = async(postId) => {
  
  const totalLike = await PostReaction.count({where: {post_id: postId, value: 1}});
  const totalDislike = await PostReaction.count({where: {post_id: postId, value: -1}});
  const post = await Post.update(
    { likes: totalLike, dislikes: totalDislike },
    { where: { post_id: postId } }
  )
  return post;
}
exports.likeAndDislikePost = async(req, res, next) => {
  console.log(req.body.like)
  const userIdentifier = req.body.userId;
  const likeStatus = req.body.like;
  const postId = req.params.id;
  

  let postReaction = await PostReaction.findOne({ where: { post_id: postId, user_id: userIdentifier } });
  if(postReaction){
    if(postReaction.value ===  likeStatus){
      await postReaction.destroy();
    }else {
      await PostReaction.update(
        { value: likeStatus },
        { where: { reaction_id: postReaction.reaction_id } }
      )
    }
  }else {
    postReaction = await PostReaction.create({
      value: likeStatus,
      user_id: userIdentifier,
      post_id: postId,
    })
  }
  try {
    const updatedPost = await updatePostStats(postId);
    res.status(201).json({ message: 'Post updated successfully!', updatedPost });
  } catch (error) {
    console.error('Error updating post stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

