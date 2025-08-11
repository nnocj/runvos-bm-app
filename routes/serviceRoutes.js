const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');
const errorHandler = require('../middleware/handleErrors');

router.post('/', errorHandler.generalHandleErrors(serviceController.postService));
router.get('/business/:businessId', errorHandler.generalHandleErrors(serviceController.getServicesByBusiness));
router.put('/:id', errorHandler.generalHandleErrors(serviceController.putService));
router.delete('/:id', errorHandler.generalHandleErrors(serviceController.deleteService));

module.exports = router;
