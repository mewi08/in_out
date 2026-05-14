const express = require('express');
const router = express.Router();

const UserController = require('./users.controller');
const {validateId} = require('../../shared/middleware/param.middleware');
const {verifyExists} = require('../../shared/middleware/exists.middleware');
const {validate} = require('../../shared/middleware/validate.middleware');
const {authMiddleware, requireAdmin} = require('../../shared/middleware/auth.middleware');
const {userSchema, updateStatusSchema} = require('./schemas/users.schema');

router.get(
    '/public',
    UserController.getPublicUsers
);
router.get(
    '/private',
    authMiddleware,
    requireAdmin,
    UserController.getAdminUsers
);

router.get(
    '/stats',
    authMiddleware,
    requireAdmin,
    UserController.getStats
);    

router.get(
    '/code/:code', 
    UserController.getByCode
);

router.get(
    '/:id', 
    validateId(), 
    verifyExists('users'), 
    UserController.getById
);

router.post(
    '/', 
    authMiddleware,  
    requireAdmin, 
    validate(userSchema), 
    UserController.create
);

router.put(
    '/:id', 
    authMiddleware,
    requireAdmin,
    validateId(), 
    verifyExists('users'), 
    validate(userSchema),
    UserController.update
);

router.patch(
    '/:id/status', 
    authMiddleware,
    requireAdmin, 
    validateId(), 
    verifyExists('users'),
    validate(updateStatusSchema),
    UserController.updateStatus
);

module.exports = router;
