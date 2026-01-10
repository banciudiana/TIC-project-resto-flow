const { findAll, create } = require('../models/categoryModel');


const getAllCategories = async (req, res) => {
    try {
        const categories = await findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const categoryId = await create(name);
        
        res.status(201).json({ 
            id: categoryId, 
            name: name,
            message: 'Category created successfully' 
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

module.exports = {
    getAllCategories,
    createCategory
};