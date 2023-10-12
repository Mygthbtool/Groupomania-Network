const Post = require('../models/post');
const fs = require('fs');

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
  const post = new Post({
    postingDate: postObj.postingDate,
    textContent: postObj.textContent,
    mltMediaContent: mltMediaContent, 
    userId: postObj.userId,
    likes: 0,
    dislikes: 0,
    comments:[],  
       
  });
  
  post.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Get one poste
exports.getOnePost = (req, res, next) => {
  //console.log(req)

  Post.findOne({_id: req.params.id})
  .populate("userId")
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
  console.log(req.body);
  let post = new Post({ _id: req.params._id });

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    post = {
      textContent: req.body.textContent,
      mltMediaContent: url + '/images/' + req.file.filename,
    };
  } else {
    post = {
      textContent: req.body.textContent,
    };
  }
  Post.updateOne({_id: req.params.id}, post).then(
    () => {
      res.status(201).json({
        message: 'Post updated successfully!'
      });
    }  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Delete post
exports.deletePost = (req, res, next) => {
  Post.findOne({_id: req.params.id}).then(
    (post) => {
      const filename = post.mltMediaContent.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Post.deleteOne({_id: req.params.id})
        .then(() => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

//Get all posts
exports.getAllPosts = (req, res, next) => {
  
  Post.find().populate('userId')
  .sort({ postingDate: -1 })
  .then((posts) => {
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Like and dislike
exports.likeAndDislikePost = (req, res, next) => {
  
    let userIdentifier = req.body.userId;
    let likeStatus = req.body.like;

    // If the user like the post, likestatus increased by 1      
        if(likeStatus === 1) {
            
            Post.updateOne({_id: req.params.id}, {$inc:{likes: +1},
                            $push:{usersLiked: userIdentifier}})
            .then(() =>   
                res.status(201).json({
                message: 'like has been added successfully!'         
                })
                
            )
            .catch((error) => {
                res.status(400).json({
                error: error});
            }) 
                                      
        }
            
    // If the user dislike the post, likestatus decreased by 1  
        else if (likeStatus === -1) {
        
            Post.updateOne({_id: req.params.id}, {$inc:{dislikes: +1},
                            $push:{usersDisliked: userIdentifier}})
            .then(() =>   
                res.status(201).json({
                message: 'dislike has been added successfully!'  
                    
                })
            )
            .catch((error) => {
                res.status(400).json({
                error: error});
            })
               
        }    
    // If the user cancel his like or dislike
    else if (likeStatus === 0) {       
        // user cancel his like
        Post.findOne({_id: req.params.id})
        .then((post) => {
                if(post.usersLiked.includes(userIdentifier)){
                    Post.updateOne({_id: req.params.id}, {$inc:{likes:-1},
                     $pull:{usersLiked:userIdentifier}})
        
                    .then(() => res.status(201).json({message: "Like has been canceled"}))
                    .catch(error => res.status(400).json(error))
                    
                }               
                //user cancel his dislike
                if(post.usersDisliked.includes(userIdentifier)){

                    Post.updateOne({_id: req.params.id}, {$inc:{dislikes:-1},
                    $pull:{usersDisliked:userIdentifier}})

                    .then(() => res.status(201).json({message: "Dislike has been canceled"}))
                    .catch(error => res.status(400).json(error))
                } 
            
        })
    } 
}

