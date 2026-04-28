const express = require('express');
const router = express.Router();

const UserController = require('./users.controller');
const {validateId} = require('../../shared/middleware/param.middleware');
const {verifyExists} = require('../../shared/middleware/exists.middleware');
const {validateInfo, validateStatus} = require('../users/domain/users.validator');
const {authMiddleware, authorizeRoles} = require('../../shared/middleware/auth.middleware');

router.get(
    '/', 
    UserController.getAll);

router.get(
    '/dni/:dni', 
    UserController.getByDni);

router.get(
    '/code/:code', 
    UserController.getByCode);
    
router.post(
    '/verify-security-code', 
    UserController.verifySecurityCode);

router.get(
    '/:id', 
    validateId(), 
    verifyExists('users'), 
    UserController.getById);

router.post(
    '/', 
    authMiddleware, 
    authorizeRoles('admin'), 
    validateInfo, 
    UserController.create
);

router.put(
    '/:id', 
    authMiddleware,
    authorizeRoles('admin'), 
    validateId(), 
    verifyExists('users'), 
    validateInfo, 
    UserController.update
);

router.patch(
    '/:id/status', 
    authMiddleware,
    authorizeRoles('admin'), 
    validateId(), 
    verifyExists('users'),
    validateStatus, 
    UserController.updateStatus
);

module.exports = router;
