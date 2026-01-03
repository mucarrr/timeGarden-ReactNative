const express = require('express');
const router = express.Router();
const { register, login, getMe, updateGardenState, getGardenState } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Garden routes
router.get('/garden', protect, getGardenState);
router.put('/garden', protect, updateGardenState);

module.exports = router;

