const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const commentsRoutes = require('./routes/comments');

const app = express();

require('dotenv').config();

const sequelize = require('./sequelize');

sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL database');
  })
  .catch((error) => {
    console.error('Error connecting to MySQL:', error);
  });

// mongoose.connect(process.env.MONGODB_URL)
//     .then(() => {
//         console.log('Successfully connected to MongoDB Atlas');
//     })
//     .catch((error) => {
//         console.log('Unable to connect to MongoDB Atlas!');
//         console.error(error);
//     });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/posts', postsRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;