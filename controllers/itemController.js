const db = require('../db');

const getItem = async (req, res) => {
  const { itemId } = req.params;
  const sql =
    'SELECT i.id, i.name, i.description, i.quantity, i.price, i.category_id, c.name AS category_name FROM items i JOIN categories c ON c.id = i.category_id WHERE i.id = $1';
  const result = await db.query(sql, [itemId]);

  if (result.rows.length === 0) {
    return res.status(404).send('Item not found');
  }

  res.render('item-detail', { item: result.rows[0], error: null });
};

const showCreateItemForm = async (req, res) => {
  const result = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
  const categories = result.rows;
  res.render('item-form', { categories });
};

const createItem = async (req, res) => {
  const { name, description, quantity, price, category_id } = req.body;
  const sql =
    'INSERT INTO items (name, description, quantity, price, category_id) VALUES ($1, $2, $3, $4, $5)';
  await db.query(sql, [name, description, quantity, price, category_id]);
  res.redirect(`/categories/${category_id}/items`);
};

const showEditItemForm = async (req, res) => {
  const { itemId } = req.params;
  const itemSql =
    'SELECT id, name, description, quantity, price, category_id FROM items WHERE id = $1';
  const categorySql = 'SELECT id, name FROM categories ORDER BY name ASC';

  const itemResult = await db.query(itemSql, [itemId]);
  const categoryResult = await db.query(categorySql);

  if (itemResult.rows.length === 0) {
    return res.status(404).send('Item not found');
  }

  res.render('item-edit-form', {
    item: itemResult.rows[0],
    categories: categoryResult.rows,
    error: null,
  });
};

const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { name, description, quantity, price, category_id, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    const itemSql =
      'SELECT id, name, description, quantity, price, category_id FROM items WHERE id = $1';
    const categorySql = 'SELECT id, name FROM categories ORDER BY name ASC';
    const itemResult = await db.query(itemSql, [itemId]);
    const categoryResult = await db.query(categorySql);

    if (itemResult.rows.length === 0) {
      return res.status(404).send('Item not found');
    }

    return res.render('item-edit-form', {
      item: itemResult.rows[0],
      categories: categoryResult.rows,
      error: 'wrong_password',
    });
  }

  const sql =
    'UPDATE items SET name = $1, description = $2, quantity = $3, price = $4, category_id = $5 WHERE id = $6';
  await db.query(sql, [name, description, quantity, price, category_id, itemId]);
  res.redirect(`/items/${itemId}`);
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;
  const { adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    const sql =
      'SELECT i.id, i.name, i.description, i.quantity, i.price, i.category_id, c.name AS category_name FROM items i JOIN categories c ON c.id = i.category_id WHERE i.id = $1';
    const result = await db.query(sql, [itemId]);

    if (result.rows.length === 0) {
      return res.status(404).send('Item not found');
    }

    return res.render('item-detail', {
      item: result.rows[0],
      error: 'wrong_password',
    });
  }

  const sql = 'DELETE FROM items WHERE id = $1';
  await db.query(sql, [itemId]);
  res.redirect('/categories');
};

module.exports = {
  getItem,
  showCreateItemForm,
  createItem,
  showEditItemForm,
  updateItem,
  deleteItem,
};
