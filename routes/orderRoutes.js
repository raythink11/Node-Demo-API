const express = require('express');
const { getAllOrders, getMyOrders, getOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder);
router.route('/my-orders').get(getMyOrders);
router.route('/').get(restrictTo('admin'), getAllOrders);
router.route('/:id').get(getOrder).patch(restrictTo('admin'), updateOrder).delete(restrictTo('admin'), deleteOrder);

module.exports = router;
