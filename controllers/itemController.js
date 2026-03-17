const db = require('../db');

const getItem = async (req, res) => {
  const { itemId } = req.params;
  const sql =
    'SELECT i.id, i.name, i.description, i.quantity, i.price, i.category_id, c.name AS category_name FROM items i JOIN categories c ON c.id = i.category_id WHERE i.id = $1';
  const result = await db.query(sql, [itemId]);

  if (result.rows.length === 0) {
    return res.status(404).send('Item not found');
  }

  res.render('item-detail', { item: result.rows[0] });
};

module.exports = {
  getItem,
};
