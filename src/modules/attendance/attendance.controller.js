const { AttendanceService } = require('./app/attendance.service');
const { Response } = require('../../shared/core/http/response');
const { generateExcel } = require('../../shared/utils/excel');
const logger = require('../../shared/infrastructure/logger');

async function create(req, res) {
    try {
        const { code, type } = req.body;
        const record = await AttendanceService.register({ code, type});
        logger.info(`Movimiento registrado para usuario ${req.body.code}: ${record.message}`);
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

async function getAttendanceReport(req, res) {
    try {
        const report = await AttendanceService.getAttendanceReport();
        return Response.sendSuccess(res, report);
    } catch (error) {
        logger.error('Error en getAttendanceReport', error);
        return Response.sendError(res, error);
    }
}

async function exportByUser(req, res) {
    try {
        const { dni } = req.params;
        const { startDate, endDate } = req.query;

        const rows = await AttendanceService.exportByUser(
            dni,
            startDate,
            endDate
        );

        await generateExcel(rows, res, `asistencia_${dni}.xlsx`);
    } catch (error) {
        logger.error('Error en exportByUser', error);
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

        await generateExcel(rows, res, `asistencia_general.xlsx`);
    } catch (error) {
        logger.error('Error en exportAll', error);
        return Response.sendError(res, error);
    }
}

module.exports = { create, getTodayHours, getTodayStatus, getAttendanceReport, exportByUser, exportAll };