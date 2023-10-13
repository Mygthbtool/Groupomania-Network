const express = require('express');
const router = express.Router();

const auth = require('../middlware/auth');

const commentsCtrl = require('../controllers/comments');

router.get('/:id', auth, commentsCtrl.getCommentsForPost);
router.post('/', auth, commentsCtrl.createComment);
//router.put('/comments/:id', auth, commentsCtrl.modifyComment);
//router.delete('/comments/:id', auth, commentsCtrl.deleteComment);

module.exports = router;