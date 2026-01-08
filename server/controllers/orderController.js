const { findAll, create } = require('../models/orderModel');


const getAllOrders = async (req, res) => {
    try {
        const orders = await findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


const createOrder = async (req, res) => {
    try {
        const { tableNumber, waiterId } = req.body;

      
        if (!tableNumber || !waiterId) {
            return res.status(400).json({ error: 'Table number and Waiter ID are required' });
        }

        const orderId = await create({ tableNumber, waiterId });
        
        res.status(201).json({ 
            id: orderId, 
            message: 'Order opened successfully' 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

module.exports = {
    getAllOrders,
    createOrder
};