const express = require('express');
const router = express.Router();

const AttendanceController = require('./attendance.controller');
const { validateId } = require('../../shared/middleware/param.middleware');
const { verifyExists } = require('../../shared/middleware/exists.middleware');
const { validateAttendance } = require('../attendance/domain/attendance.validator');

router.post('/', validateAttendance, AttendanceController.create);

router.get('/today-hours/:user_id', validateId('user_id'), verifyExists('users', 'user_id'), 
AttendanceController.getTodayHours);

module.exports = router;