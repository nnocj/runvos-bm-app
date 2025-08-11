const express = require('express');
const jwtVerify = require('../middleware/jwt');
const productController = require('../controller/productController');

const router = express.Router();

// Create product
router.post('/', jwtVerify.verifyJWT(), productController.postProduct);

// Get products by business
router.get('/business/:businessId', productController.getProductsByBusiness);

// Update product
router.put('/:id', jwtVerify.verifyJWT(), productController.putProduct);

// Delete product
router.delete('/:id', jwtVerify.verifyJWT(), productController.deleteProduct);

module.exports = router;
