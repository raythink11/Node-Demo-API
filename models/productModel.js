const sql = require('../utils/db');

exports.createProduct = async ({ name, description, price }) => {
  const [product] = await sql`
    INSERT INTO products (name, description, price)
    VALUES (${name}, ${description}, ${price})
    RETURNING id, name, description, price, created_at
  `;
  return product;
};

exports.getAllProducts = async () => {
  return await sql`
    SELECT id, name, description, price, created_at
    FROM products
    ORDER BY created_at DESC
  `;
};

exports.getProductById = async id => {
  const [product] = await sql`
    SELECT id, name, description, price, created_at
    FROM products
    WHERE id = ${id}
  `;
  return product;
};

exports.updateProductById = async (id, fields) => {
  const updateClauses = [];
  const values = [];

  if (fields.name !== undefined) {
    updateClauses.push(`name = $${values.length + 1}`);
    values.push(fields.name);
  }
  if (fields.description !== undefined) {
    updateClauses.push(`description = $${values.length + 1}`);
    values.push(fields.description);
  }
  if (fields.price !== undefined) {
    updateClauses.push(`price = $${values.length + 1}`);
    values.push(fields.price);
  }

  if (!updateClauses.length) return null;

  values.push(id);
  const query = `
    UPDATE products
    SET ${updateClauses.join(', ')}
    WHERE id = $${values.length}
    RETURNING id, name, description, price, created_at
  `;

  const result = await sql.unsafe(query, values);
  return result[0];
};

exports.deleteProductById = async id => {
  const [deleted] = await sql`
    DELETE FROM products
    WHERE id = ${id}
    RETURNING id
  `;
  return deleted;
};
