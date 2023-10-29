const express = require('express');
const router = express.Router();

const auth = require('../middlware/auth');
const multer = require('../middlware/multer-config');

const postsCtrl = require('../controllers/posts');

router.get('/', auth, postsCtrl.getAllPosts);
router.post('/', auth, multer, postsCtrl.createPost);
router.get('/:id', auth, postsCtrl.getOnePost);
router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePost);
router.post('/:id/like', auth, postsCtrl.likeAndDislikePost);
router.post('/:id/markAsRead', auth, postsCtrl.markPostRead);

module.exports = router;