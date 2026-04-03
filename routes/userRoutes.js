const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { login, signup, protect, restrictTo } = require('../controllers/authController');

router.post('/login', login);
router.post('/signup', signup);

// Protect all routes after this middleware
router.use(protect);

// Both admin and user have permission to access the below APIs 
router.use(restrictTo('admin', 'user'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;