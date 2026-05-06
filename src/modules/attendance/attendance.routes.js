const express = require('express');
const router = express.Router();

const AttendanceController = require('./attendance.controller');
const { validateId } = require('../../shared/middleware/param.middleware');
const { verifyExists } = require('../../shared/middleware/exists.middleware');
const { validateAttendance } = require('../attendance/domain/attendance.validator');
const { requireAdmin, authMiddleware } = require('../../shared/middleware/auth.middleware');

router.post(
    '/', 
    validateAttendance, 
    AttendanceController.create
);

router.get(
    '/today-hours/:user_id', 
    validateId('user_id'), 
    verifyExists('users', 'user_id'), 
    AttendanceController.getTodayHours
);

router.get(
    '/today-status/:user_id', 
    validateId('user_id'), 
    verifyExists('users','user_id'), 
    AttendanceController.getTodayStatus
);

router.get(
    '/daily-report',
    authMiddleware,
    requireAdmin,
    AttendanceController.getAttendanceReport
);

router.get(
    '/export',
    authMiddleware,
    requireAdmin,
    AttendanceController.exportAll
);

router.get(
    '/export/:dni',
    authMiddleware,
    requireAdmin,
    AttendanceController.exportByUser
);

module.exports = router;