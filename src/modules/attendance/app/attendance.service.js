const { AttendanceRepository } = require('../infrastructure/attendance.repository');
const { UserService } = require('../../users/app/users.service');
const { Attendance } = require('../domain/attendance.model');
const { AppError } = require('../../../shared/core/error/appError');
const {
    formatDateISO,
    formatTime24
} = require('../../../shared/utils/formattedTime');

class AttendanceService {
    static async #getTodayAttendances(user_id) {
        const today = new Date().toLocaleDateString('en-CA');
        const records = await AttendanceRepository.findByUserAndDate(user_id, today);
        return records.map(r => new Attendance(r));
    }

    static #validateAttendance(attendance) {
        if (!attendance.isValidType()) {
            throw new AppError('Tipo de asistencia inválido', 400);
        }
    }

    static async register(data) {
        const attendance = new Attendance(data);
        this.#validateAttendance(attendance);
        const user = await UserService.getByCodeActive(attendance.code);
        attendance.user_id = user.id;
        const todayRecords = await this.#getTodayAttendances(user.id);
        const last = todayRecords[todayRecords.length - 1];
        if (last) {
            if (last.isCheckIn() && attendance.isCheckIn()) {
                throw new AppError('Ya registraste tu entrada.', 400);
            }
            if (last.isCheckOut() && attendance.isCheckOut()) {
                throw new AppError('Ya registraste tu salida.', 400);
            }
        }
        if (attendance.isCheckOut()) {
            if (!last || !last.isCheckIn()) {
                throw new AppError('Debes registrar entrada antes de salir.', 400);
            }
        }
        const id = await AttendanceRepository.create(attendance.toJSON());
        return {
            id,
            message: attendance.isCheckIn()
                ? 'Entrada registrada'
                : 'Salida registrada'
        };
    }

    static async getAttendanceReport(page = 1, limit = 5) {
        const offset = (page - 1) * limit;
        return await AttendanceRepository.findAttendanceReport(
            limit,
            offset
        );
    }

    static buildShifts(records) {
        records.sort((a, b) => new Date(a.time_stamp) - new Date(b.time_stamp));
        const result = {};
        for (const r of records) {
            const key = r.user_id;
            if (!result[key]) {
                result[key] = {
                    dni: r.dni,
                    name: r.name,
                    last_name: r.last_name,
                    shifts: []
                };
            }
            const user = result[key];
            if (r.type === 'check_in') {
                user.shifts.push({
                    date: formatDateISO(r.time_stamp),
                    entry: r.time_stamp,
                    exit: null
                });
            }
            if (r.type === 'check_out') {
                const lastShift = [...user.shifts]
                    .reverse()
                    .find(s => !s.exit);
                if (lastShift) {
                    lastShift.exit = r.time_stamp;
                }
            }
        }
        return result;
    }

    static toExcelRowsUser(shiftsByUser) {
        const user = Object.values(shiftsByUser)[0];
        if (!user) {
            throw new AppError('No se encontraron registros para el usuario en el rango dado.', 404);
        };
        return user.shifts.map(s => ({
            date: s.date,
            entry: s.entry ? formatTime24(s.entry) : '',
            exit: s.exit ? formatTime24(s.exit) : ''
        }));
    }

    static toExcelRowsBatch(shiftsByUser) {
        const rows = [];
        for (const userId in shiftsByUser) {
            const user = shiftsByUser[userId];
            user.shifts.forEach(s => {
                rows.push({
                    dni: user.dni,
                    name: user.name,
                    lastname: user.last_name,
                    date: s.date,
                    entry: s.entry ? formatTime24(s.entry) : '',
                    exit: s.exit ? formatTime24(s.exit) : ''
                });
            });
        }
        return rows;
    }

    static async exportByUser(user_id, startDate, endDate) {
        const user = await UserService.getById(user_id);
        const records = await AttendanceRepository.findByUserAndRange(
            user_id,
            startDate,
            endDate
        );
        const shifts = this.buildShifts(records);
        return {
            rows: this.toExcelRowsUser(shifts),
            user
        };
    }

    static async exportAll(startDate, endDate) {
        const records = await AttendanceRepository.findAllByRange(
            startDate,
            endDate
        );
        const shifts = this.buildShifts(records);
        return this.toExcelRowsBatch(shifts);
    }
}

module.exports = { AttendanceService };