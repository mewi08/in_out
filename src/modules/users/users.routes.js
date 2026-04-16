const express = require('express');
const router = express.Router();

const UserController = require('./users.controller');
const {validateId} = require('../../shared/middleware/param.middleware');
const {verifyExists} = require('../../shared/middleware/exists.middleware');
const {validateInfo, validateStatus} = require('../users/domain/users.validator');


router.get('/', UserController.getAll);
router.get('/code/:entered_code', UserController.getByCode);
router.post('/verify-security-code', UserController.verifySecurityCode);

router.get('/:id', validateId(), verifyExists('users'), UserController.getById);

router.post('/', validateInfo, UserController.create);
router.put('/:id', validateId(), verifyExists('users'), validateInfo, UserController.update);
router.patch('/:id/status', validateId(), verifyExists('users'),validateStatus, UserController.updateStatus);

module.exports = router;
