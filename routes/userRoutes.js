const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const validate = require('../utilities/validateUser.js');
const errorHandler = require('../middleware/handleErrors.js');
const jwtVerify = require('../middleware/jwt.js');

// This endpoint retrieves all users from the MongoDB database
router.get("/", errorHandler.generalHandleErrors(userController.getAllUsers));

//This endpoint retrieves only one user from the MongoDB database based on the id
router.get("/:id", errorHandler.generalHandleErrors(userController.getUserById));

// This endpoint creates a new user in the MongoDB database
router.post("/", validate.userValidationRules(), validate.validateResults, errorHandler.generalHandleErrors(userController.postUser));

// This endpoint updates an existing user in the MongoDB database based on the id
router.put("/:id", jwtVerify.verifyJWT(), validate.userValidationRules(), validate.validateResults, errorHandler.generalHandleErrors(userController.putUser));

// This endpoint deletes a user from the MongoDB database based on the id
router.delete("/:id", jwtVerify.verifyJWT(), errorHandler.generalHandleErrors(userController.deleteUser));

module.exports = router;