const { AttendanceService } = require('./app/attendance.service');
const { Response } = require('../../shared/core/http/response');
const { generateExcel } = require('../../shared/utils/excel');
const { logger, logError} = require('../../shared/infrastructure/logger');

async function create(req, res) {
    try {
        const { code, type } = req.body;
        const record = await AttendanceService.register({ code, type });
        logger.info(`Movimiento registrado para usuario ${code}: ${record.message}`);
        return Response.sendCreated(res, record);
    } catch (error) {
        logError('Error en create attendance', error);
        return Response.sendError(res, error);
    }
}

async function getTodayStatus(req, res) {
    try {
        const { user_id } = req.params;
        const status = await AttendanceService.getTodayStatus(user_id);
        return Response.sendSuccess(res, status);
    } catch (error) {
        logError(`Error en getTodayStatus (${req.params.user_id})`, error);
        return Response.sendError(res, error);
    }
}

async function getAttendanceReport(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const report = await AttendanceService.getAttendanceReport(page);
        return Response.sendSuccess(res, report);
    } catch (error) {
        logError('Error en getAttendanceReport', error);
        return Response.sendError(res, error);
    }
}

async function exportByUser(req, res) {
    try {
        const { user_id } = req.params;
        const { startDate, endDate } = req.query;
        const { rows, user } = await AttendanceService.exportByUser(
            user_id,
            startDate,
            endDate
        );
        await generateExcel(rows, res, {
            mode: 'user',
            user,
            filename:
                `asistencia_${user.dni}_${startDate}_${endDate}.xlsx`
        });
    } catch (error) {
        logError('Error en exportByUser', error);
        return Response.sendError(res, error);
    }
}

async function exportAll(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const rows = await AttendanceService.exportAll(
            startDate,
            endDate
        );
        await generateExcel(rows, res, {
            mode: 'batch',
            filename: `asistencia_general_${startDate}_${endDate}.xlsx`
        });
    } catch (error) {
        logError('Error en exportAll', error);
        return Response.sendError(res, error);
    }
}

module.exports = {
    create,
    getTodayStatus,
    getAttendanceReport,
    exportByUser,
    exportAll
};