const AppError = require('../utils/appError');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getOrdersByUserId(req.user.id);
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    if (!order) {
      return next(new AppError(404, 'fail', 'Order not found'));
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return next(new AppError(403, 'fail', 'You are not allowed to view this order'));
    }

    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return next(new AppError(400, 'fail', 'Please provide productId'));
    }

    if (quantity <= 0) {
      return next(new AppError(400, 'fail', 'Quantity must be at least 1'));
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
      return next(new AppError(404, 'fail', 'Product not found'));
    }

    const totalPrice = Number(product.price) * Number(quantity);
    const order = await orderModel.createOrder({
      userId: req.user.id,
      productId,
      quantity,
      totalPrice,
    });

    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      return next(new AppError(400, 'fail', 'Please provide quantity to update'));
    }

    if (quantity <= 0) {
      return next(new AppError(400, 'fail', 'Quantity must be at least 1'));
    }

    const order = await orderModel.getOrderById(req.params.id);
    if (!order) {
      return next(new AppError(404, 'fail', 'Order not found'));
    }

    const totalPrice = Number(order.productPrice) * Number(quantity);
    const updatedOrder = await orderModel.updateOrderById(req.params.id, quantity, totalPrice);

    res.status(200).json({ status: 'success', data: { order: updatedOrder } });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderModel.deleteOrderById(req.params.id);
    if (!deleted) {
      return next(new AppError(404, 'fail', 'Order not found'));
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
