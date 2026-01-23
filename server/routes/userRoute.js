const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken, isOwner } = require('../middleware/authMiddleware');


router.get('/staff', validateToken, isOwner, userController.getStaffMembers);
router.patch('/:id', validateToken, isOwner, userController.updateEmployee);
router.delete('/:id', validateToken, isOwner, userController.removeEmployee);

module.exports = router;