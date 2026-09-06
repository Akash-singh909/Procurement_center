const express = require('express');
const router = express.Router();
const controller = require('../controllers/tokenController');

router.get('/', controller.getAllTokens);

module.exports = router;
