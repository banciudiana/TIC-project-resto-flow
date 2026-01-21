const { validationResult } = require('express-validator');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const createProduct = async (req, res) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, price, categoryId } = req.body;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const newProduct = {
            name,
            price: parseFloat(price),
            category: {
                id: category.id,
                name: category.name
            }
        };

        const productId = await productModel.create(newProduct);
        res.status(201).json({ id: productId, ...newProduct });
    } catch (error) {
        console.error("EROARE SERVER:", error); 
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { name, price, categoryId } = req.body;

        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let updateData = {
            name,
            price: parseFloat(price)
        };

     
        if (categoryId && categoryId !== existingProduct.category.id) {
            const newCategory = await categoryModel.findById(categoryId);
            if (!newCategory) {
                return res.status(404).json({ error: 'New category not found!' });
            }
            updateData.category = {
                id: newCategory.id,
                name: newCategory.name
            };
        }

        const updatedProduct = await productModel.update(id, updateData);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await productModel.remove(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};