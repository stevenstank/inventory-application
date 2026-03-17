const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.get('/:categoryId/items', categoryController.listItemsByCategory);

module.exports = router;
