const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');

exports.signup = (req, res, next) => {
  const userObj = req.body;
  console.log({userObj});
  const url = req.protocol + '://' + req.get('host');
  let avatar = './images/User-avatar.png'; // Initialize avatar

  // Check if a file has been uploaded
  if (req.file) {
    avatar = url + '/images/' + req.file.filename;
  }
    bcrypt.hash(userObj.password, 10).then(
      (hash) => {
        const user = new User({
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email,
          password: hash,
          avatar: avatar
        });
        user.save().then(
          () => {
            res.status(201).json({
              message: 'User added successfully!'
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
    );
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
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
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' });
            res.status(200).json({
              user: {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
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