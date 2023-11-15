const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');

exports.signup = (req, res, next) => {
  const userObj = req.body;
  
  const url = req.protocol + '://' + req.get('host');
  let avatar = './images/User-avatar.png'; // Initialize avatar
  //Check if a file has been uploaded
  if (req.file) {
    avatar = url + '/images/' + req.file.filename;
  }
  // Encrypt the password using bcrypt
    bcrypt.hash(userObj.password, 10).then(
      (hash) => {
        // Create a new user object with hashed password
        // const user = new User({
        //   firstName: userObj.firstName,
        //   lastName: userObj.lastName,
        //   email: userObj.email,
        //   password: hash,
        //   avatar: avatar
        // });
        User.create({
          first_name: userObj.firstName,
          last_name: userObj.lastName,
          email: userObj.email,
          password: hash,
          avatar: avatar
      }).then(function (user) {
          if (user) {
              res.send(user);
          } else {
              response.status(400).send('Error in insert new record');
          }
      });
         // Save the user data to the MySQL database
        // User.create(user).then(
        //   () => {
        //     res.status(201).json({
        //       message: 'User added successfully!'
        //     });
        //   }
        // ).catch(
        //   (error) => {
        //     res.status(500).json({
        //       error: error
        //     });
        //   }
        // );
      }
    );
};

exports.login = (req, res, next) => {
  
    User.findOne({ where: {email: req.body.email }}).then(
      (user) => {
        if (!user) {
          return res.status(401).json({
            error: new Error('User not found!')
          });
        }
        bcrypt.compare(req.body.password, user.password).then(
          (valid) => {
            if (!valid) {
              return res.status(401).json({
                error: new Error('Incorrect password!')
              });
            }
            const token = jwt.sign(
              { userId: user.user_id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' });
            res.status(200).json({
              user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatar: user.avatar,
                token: token
  
              }
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              error: error
            });
          }
        );
      }
    ).catch(
      (error) => {
        res.status(500).json({
          error: error
        });
      }
    );
  }

exports.deleteAccount = (req, res, next) => {
    // Get the user ID from the request parameters
    const userId = req.params.userId;
  
    // Your deletion logic here, for example:
    User.findByIdAndDelete(userId)
      .then(() => {
        // Optionally, you can also delete the user's posts, comments, etc. if needed
        // ...
  
        res.status(200).json({ message: 'Account deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  };
  
exports.EditUserAccount = (req, res, next) => {
  console.log(req.params);
  User.findOne({_id: req.params.userId})
  .then((user) => {

      console.log({user})
      delete user._id
      if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        user.avatar = url + '/images/' + req.file.filename
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
       
      if (req.body.password) {
        bcrypt.hash(req.body.password, 10).then((hash) => {
            user.password = hash;
            User.updateOne({_id: req.params.userId}, user)
            .then(() => {
              res.status(201).json({
                message: 'User account updated successfully!'
              });
            }).catch((error) => {
              res.status(400).json({
                error: error
              });
            });
        })
      }
      else {
          User.updateOne({_id: req.params.userId}, user)
          .then(() => {
            res.status(201).json({
              message: 'User account updated successfully!'
            });
          }).catch((error) => {
            res.status(400).json({
              error: error
            });
          });
      }
  })
} 