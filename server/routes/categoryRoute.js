const express = require('express');
const router = express.Router();
const{categoryValidation} = require('../validators/categoryValidator');

const { 
    getAllCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');

const { validateToken, isOwner } = require('../middleware/authMiddleware');


router.get('/', validateToken, getAllCategories);

router.post('/', validateToken, isOwner, categoryValidation, createCategory);
router.put('/:id', validateToken, isOwner, categoryValidation, updateCategory);
router.delete('/:id', validateToken, isOwner, deleteCategory);

module.exports = router;