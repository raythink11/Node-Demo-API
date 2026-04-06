const sql = require('../utils/db');

exports.createOrder = async ({ userId, productId, quantity, totalPrice }) => {
  const [order] = await sql`
    INSERT INTO orders (user_id, product_id, quantity, total_price)
    VALUES (${userId}, ${productId}, ${quantity}, ${totalPrice})
    RETURNING id, user_id AS userId, product_id AS productId, quantity, total_price AS totalPrice, created_at
  `;
  return order;
};

exports.getOrderById = async id => {
  const [order] = await sql`
    SELECT o.id,
           o.user_id AS userId,
           o.product_id AS productId,
           o.quantity,
           o.total_price AS totalPrice,
           o.created_at,
           p.name AS productName,
           p.price AS productPrice,
           u.name AS userName,
           u.email AS userEmail
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ${id}
  `;
  return order;
};

exports.getOrdersByUserId = async userId => {
  return await sql`
    SELECT o.id,
           o.user_id AS userId,
           o.product_id AS productId,
           o.quantity,
           o.total_price AS totalPrice,
           o.created_at,
           p.name AS productName,
           p.price AS productPrice
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = ${userId}
    ORDER BY o.created_at DESC
  `;
};

exports.getAllOrders = async () => {
  return await sql`
    SELECT o.id,
           o.user_id AS userId,
           o.product_id AS productId,
           o.quantity,
           o.total_price AS totalPrice,
           o.created_at,
           p.name AS productName,
           p.price AS productPrice,
           u.name AS userName,
           u.email AS userEmail
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
};

exports.updateOrderById = async (id, quantity, totalPrice) => {
  const [updated] = await sql`
    UPDATE orders
    SET quantity = ${quantity}, total_price = ${totalPrice}
    WHERE id = ${id}
    RETURNING id, user_id AS userId, product_id AS productId, quantity, total_price AS totalPrice, created_at
  `;
  return updated;
};

exports.deleteOrderById = async id => {
  const [deleted] = await sql`
    DELETE FROM orders
    WHERE id = ${id}
    RETURNING id
  `;
  return deleted;
};
