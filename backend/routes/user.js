const express = require('express');
const router = express.Router();
const multer = require('../middlware/multer-config');
const userCtrl = require('../controllers/user');

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:userId', userCtrl.deleteAccount);
router.put('/:userId', multer, userCtrl.EditUserAccount);

module.exports = router;