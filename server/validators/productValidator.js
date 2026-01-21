const { body } = require('express-validator');
const { findByName } = require('../models/productModel');

const productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name of the product is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .custom(async (value) => {
            const exists = await findByName(value);
            if (exists) {
                throw new Error('There is already a product with this name!');
            }
            return true;
        }),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a valid number')
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                throw new Error('Price must be a positive number');
            }
            return true;
        }),

    body('categoryId')
        .notEmpty().withMessage('Category ID is required and must be valid')
];

module.exports = { productValidation };