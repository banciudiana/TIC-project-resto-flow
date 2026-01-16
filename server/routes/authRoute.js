const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { validateToken, isOwner } = require('../middleware/authMiddleware');




router.post('/login', authController.login);


router.post('/register-owner', authController.registerOwner);

router.post('/register-waiter-or-chef', validateToken, isOwner, authController.register);

module.exports = router;