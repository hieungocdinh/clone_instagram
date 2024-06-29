const express = require('express');
const router = express.Router();

const VerifyUserMiddleware = require('../app/middlewares/VerifyUserMiddleware');
const searchController = require('../app/controllers/SearchController');

router.get('/', VerifyUserMiddleware, searchController.index);

module.exports = router;