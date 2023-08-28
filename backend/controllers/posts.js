const Post = require('../models/post');
const fs = require('fs');

exports.createPost = (req, res, next) => {
  console.log(req);
  req.body.post = JSON.parse(req.body.post);
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    userFirstName: req.body.post.userFirstName,
    userLastName: req.body.post.userLastName,
    userAvatar: req.body.post.userAvatar,
    postingDate: req.body.post.postingDate,
    textContent: req.body.post.textContent,
    multiMediaContent: url + '/images/' + req.file.filename,
    userId: req.body.post.userId,
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

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyPost = (req, res, next) => {
  let post = new Post({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.post = JSON.parse(req.body.post);
    post = {
      _id: req.params.id,
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      userAvatar: req.body.userAvatar,
      postingDate: req.body.postingDate,
      textContent: req.body.post.textContent,
      multiMediaContent: url + '/images/' + req.file.filename,
      userId: req.body.post.userId
    };
  } else {
    post = {
      _id: req.params.id,
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      userAvatar: req.body.userAvatar,
      postingDate: req.body.postingDate,
      textContent: req.body.textContent,
      userId: req.body.userId
    };
  }
  Post.updateOne({_id: req.params.id}, post).then(
    () => {
      res.status(201).json({
        message: 'Post updated successfully!'
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

exports.deletePost = (req, res, next) => {
  Post.findOne({_id: req.params.id}).then(
    (post) => {
      const filename = post.imageUrl.split('/images/')[1];
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

exports.getAllPosts = (req, res, next) => {
  Post.find().then(
    (posts) => {
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




