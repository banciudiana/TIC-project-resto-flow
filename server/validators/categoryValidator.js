const { body } = require('express-validator');
const { findByName } = require('../models/categoryModel');

const categoryValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .custom(async (value) => {
       
            const exists = await findByName(value);
            if (exists) {
                throw new Error('This category already exists!');
            }
            return true;
        })
];

module.exports = { categoryValidation };