const { AttendanceService } = require('./app/attendance.service');
const { Response } = require('../../shared/utils/response');
const logger = require('../../shared/utils/logger');

async function create(req, res) {
    try {
        const record = await AttendanceService.register(req.body);

        logger.info(`Asistencia registrada: ${record.id}`);

        Response.sendSuccess(res, record);
    } catch (error) {
        logger.error(`Error en create attendance: ${error.message}`);
        Response.sendError(res, error);
    }
}

async function getTodayHours(req, res) {
    try {
        const hours = await AttendanceService.getTodayHours(req.params.user_id);

        Response.sendSuccess(res, hours);
    } catch (error) {
        logger.error(`Error en getTodayHours attendance (${req.params.user_id}): ${error.message}`);
        Response.sendError(res, error);
    }
}

module.exports = { create, getTodayHours };