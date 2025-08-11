const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');

router.post('/', serviceController.postService);
router.get('/business/:businessId', serviceController.getServicesByBusiness);
router.put('/:id', serviceController.putService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
