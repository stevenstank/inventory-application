const db = require('../db');

const listCategories = async (req, res) => {
  const result = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
  const categories = result.rows;
  res.render('categories', { categories });
};

const listItemsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const categorySql = 'SELECT id, name FROM categories WHERE id = $1';
  const itemSql =
    'SELECT id, name, description, quantity, price, category_id FROM items WHERE category_id = $1 ORDER BY name ASC';

  const categoryResult = await db.query(categorySql, [categoryId]);
  const itemResult = await db.query(itemSql, [categoryId]);

  if (categoryResult.rows.length === 0) {
    return res.status(404).send('Category not found');
  }

  res.render('category-items', {
    category: categoryResult.rows[0],
    items: itemResult.rows,
  });
};

const showCreateCategoryForm = (req, res) => {
  res.render('category-form');
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO categories (name) VALUES ($1)';
  await db.query(sql, [name]);
  res.redirect('/categories');
};

const showEditCategoryForm = async (req, res) => {
  const { categoryId } = req.params;
  const sql = 'SELECT id, name FROM categories WHERE id = $1';
  const result = await db.query(sql, [categoryId]);

  if (result.rows.length === 0) {
    return res.status(404).send('Category not found');
  }

  res.render('category-edit-form', { category: result.rows[0], error: null });
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    const categoryResult = await db.query('SELECT id, name FROM categories WHERE id = $1', [categoryId]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).send('Category not found');
    }

    return res.render('category-edit-form', {
      category: categoryResult.rows[0],
      error: 'wrong_password',
    });
  }

  const sql = 'UPDATE categories SET name = $1 WHERE id = $2';
  await db.query(sql, [name, categoryId]);
  res.redirect('/categories');
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    const categoryResult = await db.query('SELECT id, name FROM categories WHERE id = $1', [categoryId]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).send('Category not found');
    }

    return res.render('category-edit-form', {
      category: categoryResult.rows[0],
      error: 'wrong_password',
    });
  }

  const countSql = 'SELECT COUNT(*)::int AS item_count FROM items WHERE category_id = $1';
  const countResult = await db.query(countSql, [categoryId]);

  if (countResult.rows[0].item_count > 0) {
    const categoryResult = await db.query('SELECT id, name FROM categories WHERE id = $1', [categoryId]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).send('Category not found');
    }

    return res.status(400).render('category-edit-form', {
      category: categoryResult.rows[0],
      error: 'has_items',
    });
  }

  const deleteSql = 'DELETE FROM categories WHERE id = $1';
  await db.query(deleteSql, [categoryId]);
  res.redirect('/categories');
};

module.exports = {
  listCategories,
  listItemsByCategory,
  showCreateCategoryForm,
  createCategory,
  showEditCategoryForm,
  updateCategory,
  deleteCategory,
};
