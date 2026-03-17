const express = require('express');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/new', itemController.showCreateItemForm);
router.post('/', itemController.createItem);
router.get('/:itemId/edit', itemController.showEditItemForm);
router.post('/:itemId/edit', itemController.updateItem);
router.post('/:itemId/delete', itemController.deleteItem);
router.get('/:itemId', itemController.getItem);

module.exports = router;
