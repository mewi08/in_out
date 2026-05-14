const { ActivityLogService } = require('./app/activity_log.service');
const { Response } = require('../../shared/core/http/response');
const logger = require('../../shared/infrastructure/logger');

async function getRecent(req, res, next) {
    try {
        const logs = await ActivityLogService.getRecent();

        return Response.sendSuccess(res, logs);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRecent
};