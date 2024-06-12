const express = require('express');
const router = express.Router();

const verifyUser = require('../app/middlewares/VerifyUserMiddleware');
const homeController = require('../app/controllers/HomeController');

router.get('/', verifyUser, homeController.index)

module.exports = router;