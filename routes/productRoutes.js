const express = require('express');
const jwtVerify = require('../middleware/jwt');
const productController = require('../controller/productController');
const errorHandler = require('../middleware/handleErrors');

const router = express.Router();

// Create product
router.post('/', jwtVerify.verifyJWT(), errorHandler.generalHandleErrors(productController.postProduct));

// Get products by business
router.get('/business/:businessId', errorHandler.generalHandleErrors(productController.getProductsByBusiness));

// Update product
router.put('/:id', jwtVerify.verifyJWT(), errorHandler.generalHandleErrors(productController.putProduct));

// Delete product
router.delete('/:id', jwtVerify.verifyJWT(), errorHandler.generalHandleErrors(productController.deleteProduct));

module.exports = router;
