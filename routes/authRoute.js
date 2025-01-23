var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/users', authController.getUsers);
router.patch('/setDeviceId', protect, authController.setDeviceId);

module.exports = router;
