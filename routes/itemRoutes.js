const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/:itemId', itemController.getItem);

module.exports = router;
