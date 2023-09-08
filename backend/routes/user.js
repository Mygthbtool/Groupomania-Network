const express = require('express');
const router = express.Router();
const multer = require('multer');
const userCtrl = require('../controllers/user');

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;