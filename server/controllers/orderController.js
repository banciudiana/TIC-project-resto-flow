const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const { validationResult } = require('express-validator');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { tableNumber, notes } = req.body;

        const waiterId = req.user.userId;
        if (!waiterId) {
            return res.status(401).json({ error: "User ID not found in token payload" });
        }
    
        const orderData = {
            tableNumber: parseInt(tableNumber),
            waiterId: waiterId,
            notes: notes || "",
            status: 'PENDING',
            items: [],
            totalAmount: 0
        };

    

        const orderId = await orderModel.create(orderData);
        res.status(201).json({ id: orderId, ...orderData, status: 'PENDING' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order',message: error.message,stack: error.stack });
    }
};

const addProductToOrder = async (req, res) => {
    try {
        const { id } = req.params; 
        const { productId } = req.body;

     
        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

    
        const order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (order.status === 'DELIVERED') {
            return res.status(400).json({ error: 'Cannot add products to a delivered order' });
        }

      
        const result = await orderModel.addProductToOrder(id, {
            id: product.id,
            name: product.name,
            price: product.price
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const currentUserId = req.user.userId; 
        const userRole = req.user.role;

        const order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

     

        if (['COOKING', 'READY'].includes(status)) {
            if (userRole !== 'ROLE_CHEF') {
                return res.status(403).json({ error: 'Only the Chef can update to Cooking/Ready' });
            }
        }

     
        if (status === 'DELIVERED') {
            if (userRole !== 'ROLE_WAITER') {
                return res.status(403).json({ error: 'Only the Waiter can mark order as Delivered' });
            }
            if (order.status !== 'READY') {
                return res.status(400).json({ error: 'Order must be READY before being DELIVERED' });
            }
        }

        
        let extraFields = {};
        if (status === 'COOKING') {
            extraFields.chefId = currentUserId;
        }

        const updated = await orderModel.updateStatus(id, status, extraFields);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

       
        if (order.status !== 'PENDING' && req.user.role !== 'ROLE_OWNER') {
            return res.status(400).json({ error: 'Only pending orders can be deleted' });
        }

        await orderModel.remove(id);
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};


const removeProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const { index, price } = req.body; 

        const order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });


        if (order.status !== 'PENDING') {
            return res.status(400).json({ error: 'Cannot remove products from an order that has already been processed by the kitchen!' });
        }

        const result = await orderModel.removeProductFromOrder(id, index, price);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllOrders,
    createOrder,
    addProductToOrder,
    updateOrderStatus,
    deleteOrder,removeProduct
};