const express = require('express');
const router = express.Router();
const { WorkAreaController } = require('./work_area.controller');
const { verifyExists } = require('../../shared/middleware/exists.middleware');
const { validateId } = require('../../shared/middleware/param.middleware');
const { validate } = require('../../shared/middleware/validate.middleware');
const { workAreaSchema, updateStatus } = require('./schema/work_area.schema');
router.get(
    '/',
    WorkAreaController.getAll
);

router.get(
    '/:id',
    validateId(),
    WorkAreaController.getById
);

router.post(
    '/',
    validate(workAreaSchema),
    WorkAreaController.create
);

router.patch(
    '/:id',
    validateId(),
    validate(workAreaSchema),
    verifyExists('work_area'),
    WorkAreaController.update
);

router.patch(
    '/:id/status',
    validateId(),
    validate(updateStatus),
    verifyExists('work_area'),
    WorkAreaController.updateStatus
);

module.exports = router;