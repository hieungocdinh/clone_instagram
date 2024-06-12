const express = require('express');
const router = express.Router();

const logoutController = require('../app/controllers/LogoutController');
const verifyUser = require('../app/middlewares/VerifyUserMiddleware');


router.get('/', verifyUser, logoutController.index)

module.exports = router;