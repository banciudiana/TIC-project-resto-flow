const { findAll, create, update, remove, findById} = require('../models/categoryModel');
const { validationResult } = require('express-validator');

const getAllCategories = async (req, res) => {
    try {
        const categories = await findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const createCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const id = await create({ name });
        res.status(201).json({ id, name });
    } catch (error) {
    
        res.status(500).json({ error: 'Failed to create category', details: error.message });
    
        
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const existing = await findById(id);
        if (!existing) return res.status(404).json({ error: 'Category not found' });

        const updated = await update(id, { name });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await remove(id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

module.exports =
 { getAllCategories,
     createCategory, 
     updateCategory, 
     deleteCategory };