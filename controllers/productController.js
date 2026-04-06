const AppError = require('../utils/appError');
const productModel = require('../models/productModel');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json({ status: 'success', results: products.length, data: { products } });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return next(new AppError(404, 'fail', 'Product not found'));
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price === undefined) {
      return next(new AppError(400, 'fail', 'Product name and price are required'));
    }

    const product = await productModel.createProduct({ name, description, price });
    res.status(201).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productModel.updateProductById(req.params.id, req.body);
    if (!product) {
      return next(new AppError(404, 'fail', 'Product not found or no fields to update'));
    }
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productModel.deleteProductById(req.params.id);
    if (!deleted) {
      return next(new AppError(404, 'fail', 'Product not found'));
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
