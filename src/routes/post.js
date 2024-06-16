const express = require('express');
const router = express.Router();

const uploadPostImgMiddleware = require('../app/middlewares/UploadPostImgMiddleware');
const VerifyUserMiddleware = require('../app/middlewares/VerifyUserMiddleware');
const postController = require('../app/controllers/PostController');

router.put('/edit/:postId', VerifyUserMiddleware, uploadPostImgMiddleware, postController.edit);
router.delete('/delete/:postId', VerifyUserMiddleware, postController.delete);
router.post('/create', VerifyUserMiddleware, uploadPostImgMiddleware, postController.create);
router.post('/like/:postId', VerifyUserMiddleware, postController.like);
router.post('/comment/:postId', VerifyUserMiddleware, postController.comment);
router.get('/:postId', VerifyUserMiddleware, postController.index);

module.exports = router;