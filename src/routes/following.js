const express = require('express');
const router = express.Router();

const VerifyUserMiddleware = require('../app/middlewares/VerifyUserMiddleware');
const followingController = require('../app/controllers/FollowingController');

router.post('/follow/:username', VerifyUserMiddleware, followingController.follow);
router.delete('/unfollow/:username', VerifyUserMiddleware, followingController.unfollow);

module.exports = router;