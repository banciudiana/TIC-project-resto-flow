const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

const { productValidation } = require('../validators/productValidator');
const { validateToken, isOwner } = require('../middleware/authMiddleware');

//Every role can view products
router.get('/', validateToken, getAllProducts);

// Only owners can create, update, or delete products
router.post('/', validateToken, isOwner, productValidation, createProduct);
router.put('/:id', validateToken, isOwner, productValidation, updateProduct);
router.delete('/:id', validateToken, isOwner, deleteProduct);

module.exports = router;