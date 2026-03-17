const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.get('/new', categoryController.showCreateCategoryForm);
router.post('/', categoryController.createCategory);
router.get('/:categoryId/edit', categoryController.showEditCategoryForm);
router.post('/:categoryId/edit', categoryController.updateCategory);
router.get('/:categoryId/items', categoryController.listItemsByCategory);

module.exports = router;
