const express = require('express');
const router = express.Router();

const UploadAvatarImgMiddleware = require('../app/middlewares/UploadAvatarImgMiddleware');
const verifyUser = require('../app/middlewares/VerifyUserMiddleware');
const profileController = require('../app/controllers/ProfileController');

router.get('/:username', verifyUser, profileController.index)
router.get('/:username/edit', verifyUser, profileController.edit)
router.put('/:username/stored', verifyUser, UploadAvatarImgMiddleware, profileController.stored)

module.exports = router;