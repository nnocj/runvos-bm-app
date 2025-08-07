const router =  new require('express').Router();
const businessController = require('../controller/businessController');
const businessValidate = require('../utilities/validateBusiness.js');
const  errorHandler = require('../middleware/handleErrors');

// Serve static files from the public folder
// This endpoint retrieves all businesses from the MongoDB database
router.get('/',   errorHandler.generalHandleErrors(businessController.getAllBusinesses));

// This endpoint retrieves all businesses from the MongoDB database
router.get('/:id', errorHandler.generalHandleErrors(businessController.getBusinessById));

// This endpoint creates a new business in the MongoDB database
router.post('/', businessValidate.businessValidationRules(), businessValidate.validateResults, errorHandler.generalHandleErrors(businessController.postBusiness));

// This endpoint updates an existing business in the MongoDB database based on the id
router.put('/:id', businessValidate.businessValidationRules(), businessValidate.validateResults, errorHandler.generalHandleErrors(businessController.putBusiness));

// This endpoint deletes a business from the MongoDB database based on the id
router.delete('/:id', errorHandler.generalHandleErrors(businessController.deleteBusiness));

module.exports = router;