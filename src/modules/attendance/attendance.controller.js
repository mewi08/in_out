const { AttendanceService } = require('./app/attendance.service');
const { Response } = require('../../shared/core/http/response');
const { generateExcel } = require('../../shared/utils/excel');
const { logger, logError} = require('../../shared/infrastructure/logger');
const { ActivityLogService } = require('../activity_log/app/activity_log.service');
async function create(req, res, next) {
    try {
        const { code, type } = req.body;
        const record = await AttendanceService.register({ code, type });
        logger.info(`Movimiento registrado para usuario ${code}: ${record.message}`);
        return Response.sendCreated(res, record);
    } catch (error) {
        next(error);
    }
}

async function getTodayStatus(req, res, next) {
    try {
        const { user_id } = req.params;
        const status = await AttendanceService.getTodayStatus(user_id);
        return Response.sendSuccess(res, status);
    } catch (error) {
        next(error);
    }
}

async function getAttendanceReport(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const report = await AttendanceService.getAttendanceReport(page);
        return Response.sendSuccess(res, report);
    } catch (error) {
        next(error);
    }
}

async function exportByUser(req, res, next) {
    try {
        const { user_id } = req.params;
        const { startDate, endDate } = req.query;
        const { rows, user } = await AttendanceService.exportByUser(
            user_id,
            startDate,
            endDate
        );
        await ActivityLogService.create({
            user_id: req.user.id,
            action: 'Export_attendance_by_user',
            description: `Exportó asistencia desde ${startDate} hasta ${endDate} para el usuario (${user.dni})`
        });
        await generateExcel(rows, res, {
            mode: 'user',
            user,
            filename:
                `asistencia_${user.dni}_${startDate}_${endDate}.xlsx`
        });
    } catch (error) {
        next(error);
    }
}

async function exportAll(req, res, next) {
    try {
        const { startDate, endDate } = req.query;
        const rows = await AttendanceService.exportAll(
            startDate,
            endDate
        );
        await ActivityLogService.create({
            user_id: req.user.id,
            action: 'Export_attendance_all',
            description: `Exportó asistencia general desde ${startDate} hasta ${endDate}`
        });
        await generateExcel(rows, res, {
            mode: 'batch',
            filename: `asistencia_general_${startDate}_${endDate}.xlsx`
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    getTodayStatus,
    getAttendanceReport,
    exportByUser,
    exportAll
};