const express = require('express');
const router = express.Router();

const UserController = require('./users.controller');
const {validateId} = require('../../shared/middleware/param.middleware');
const {verifyExists} = require('../../shared/middleware/exists.middleware');
const {validateInfo, validateStatus} = require('../users/domain/users.validator');
const {authMiddleware, requireAdmin} = require('../../shared/middleware/auth.middleware');

router.get(
    '/',
    UserController.getAll);

router.get(
    '/dni/:dni', 
    UserController.getByDni);

router.get(
    '/code/:code', 
    UserController.getByCode);

router.get(
    '/:id', 
    validateId(), 
    verifyExists('users'), 
    UserController.getById);

router.post(
    '/', 
    authMiddleware,  
    validateInfo, 
    requireAdmin, 
    UserController.create
);

router.put(
    '/:id', 
    authMiddleware,
    validateId(), 
    verifyExists('users'), 
    validateInfo,     
    requireAdmin, 
    UserController.update
);

router.patch(
    '/:id/status', 
    authMiddleware,
    validateId(), 
    verifyExists('users'),
    validateStatus,
    requireAdmin,  
    UserController.updateStatus
);

module.exports = router;
