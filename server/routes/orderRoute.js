const express = require('express');
const router = express.Router();
const { 
    getAllOrders, 
    createOrder, 
    addProductToOrder, 
    updateOrderStatus, 
    deleteOrder,removeProduct, updateOrder
} = require('../controllers/orderController');


const { validateToken, isWaiter, isChef, isOwner } = require('../middleware/authMiddleware');

router.get('/', validateToken, getAllOrders);


router.post('/', validateToken, isWaiter, createOrder);

router.post('/:id/add-product', validateToken, isWaiter, addProductToOrder);

router.patch('/:id/status', validateToken, updateOrderStatus);

router.delete('/:id', validateToken, deleteOrder);
router.delete('/:id/remove-product', validateToken, isWaiter, removeProduct);
router.put('/:id', validateToken, isWaiter, updateOrder);

module.exports = router;