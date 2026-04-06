const express = require('express');
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getAllProducts);
router.route('/:id').get(getProduct);

router.use(protect);
router.use(restrictTo('admin'));

router.route('/').post(createProduct);
router.route('/:id').patch(updateProduct).delete(deleteProduct);

module.exports = router;
