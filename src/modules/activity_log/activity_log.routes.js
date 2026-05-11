const express = require('express');
const router = express.Router();

const ActivityLogController =
    require('./activity_log.controller');

const {
    authMiddleware,
    requireAdmin
} = require('../../shared/middleware/auth.middleware');

router.get(
    '/recent',
    authMiddleware,
    requireAdmin,
    ActivityLogController.getRecent
);

module.exports = router;