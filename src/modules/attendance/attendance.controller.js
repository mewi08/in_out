const { AttendanceService } = require('./app/attendance.service');
const { Response } = require('../../shared/utils/response');
const logger = require('../../shared/utils/logger');

async function create(req, res) {
    try {
        const record = await AttendanceService.register(req.body);
        logger.info(`Asistencia registrada para usuario ${req.body.code}: ${record.id}`);
        return Response.sendCreated(res, record);
    } catch (error) {
        logger.error('Error en create attendance', error);
        return Response.sendError(res, error);
    }
}

async function getTodayHours(req, res) {
    try {
        const hours = await AttendanceService.getTodayHours(req.params.user_id);
        return Response.sendSuccess(res, hours);
    } catch (error) {
        logger.error(`Error en getTodayHours attendance (${req.params.user_id})`, error);
        return Response.sendError(res, error);
    }
}

async function getTodayStatus(req, res) {
    try{
        const { user_id } = req.params;
        const status = await AttendanceService.getTodayStatus(user_id);
        return Response.sendSuccess(res, status);
    }catch(error){
        logger.error(`Error en getTodayStatus (${req.params.user_id})`, error);
        return Response.sendError(res, error);
    }
}

module.exports = { create, getTodayHours, getTodayStatus };