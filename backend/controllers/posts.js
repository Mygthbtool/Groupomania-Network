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
      PostReaction.destroy({ where: { post_id: req.params.id } });
      PostReader.destroy({ where: { post_id: req.params.id } });
      Comment.destroy({ where: { post_id: req.params.id } });
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
    ],
    order: [['posting_date', 'DESC']]  // sort by postingDate in descending order
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

// Mark post as read
exports.markPostRead = async (req, res, next) => {
  
 // console.log(req.body)
  const postId = req.params.id;
  const userIdentifier = req.body.userId
  try {
    const postReader = await PostReader.findOne({ where: { post_id: postId, user_id: userIdentifier }})  
    // Check if the user ID is not already in the 'readBy' array to avoid duplicates.
  
    if (!postReader) {
      PostReader.create({
        user_id: userIdentifier,
        post_id: postId
      });
      res.status(201).json({ message: 'Post marked as read successfully!' });
    } else {
      res.status(200).json({ message: 'Post already marked as read.' });
    }
  } catch (error) {
    console.error('Error marking post as read:', error);
    res.status(500).json({ error: 'Failed to mark post as read' });
  }
 }

// fetch post readers
exports.getPostReaders = async (req, res, next) => {
 // console.log(req.params.userId)
  // const userIdentifier = req.userId;
  const postId = req.params.id;

  try {
    const postReaders = await PostReader.findAll({ where: { post_id: postId }});
    res.status(200).json(postReaders);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

updatePostStats = async(postId) => {
  
  const totalLike = await PostReaction.count({where: {post_id: postId, value: 1}});
  const totalDislike = await PostReaction.count({where: {post_id: postId, value: -1}});
    await Post.update(
    { likes: totalLike, dislikes: totalDislike },
    { where: { post_id: postId } }
  )
      return Post.findOne( {where: {post_id: postId}})
}
exports.likeAndDislikePost = async(req, res, next) => {
  //console.log(req.body.like)
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
    console.log(updatedPost)
    res.status(201).json({ message: 'Post updated successfully!', updatedPost });
  } catch (error) {
    console.error('Error updating post stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

