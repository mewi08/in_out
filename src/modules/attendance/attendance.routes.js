const express = require('express');
const router = express.Router();

const AttendanceController = require('./attendance.controller');
const { validateId } = require('../../shared/middleware/param.middleware');
const { verifyExists } = require('../../shared/middleware/exists.middleware');
const { validate } = require('../../shared/middleware/validate.middleware');
const { requireAdmin, authMiddleware } = require('../../shared/middleware/auth.middleware');
const { attendanceSchema, exportAllSchema, exportUserSchema } = require('./schemas/attendance.schema');

router.post(
    '/', 
    validate(attendanceSchema), 
    AttendanceController.create
);

router.get(
    '/today-status/:user_id', 
    validateId('user_id'), 
    verifyExists('users','user_id'), 
    AttendanceController.getTodayStatus
);

router.get(
    '/reports/daily',
    authMiddleware,
    requireAdmin,
    AttendanceController.getAttendanceReport
);

router.get(
    '/reports/export',
    authMiddleware,
    requireAdmin,
    validate(exportAllSchema, 'query'),
    AttendanceController.exportAll
);

router.get(
    '/reports/export/:user_id',
    authMiddleware,
    requireAdmin,
    validateId('user_id'),
    verifyExists('users', 'user_id'),
    validate(exportUserSchema, 'query'),
    AttendanceController.exportByUser
);

module.exports = router;