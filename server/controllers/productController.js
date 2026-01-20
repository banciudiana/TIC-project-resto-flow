const { findAll, findById, create, remove } = require('../models/productModel');

const getAllProducts = async (req, res) => {
    try {
        const products = await findAll();
        res.status(200).json(products);
    } catch(error) {
        res.status(500).json({ error: 'Failed to get products' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, category, description, available } = req.body;

        const newProduct = {
            name: name,    
            price: parseFloat(price),
            category: category ,
            description: description || '',
            available: available !== undefined ? available : true,
            createdAt: new Date().toISOString()
        };

        const productId = await create(newProduct);
        res.status(201).json({ id: productId, ...newProduct });
    } catch(error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
};

module.exports = { getAllProducts, createProduct };