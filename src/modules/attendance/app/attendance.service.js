const { AttendanceRepository } = require('../infrastructure/attendance.repository');
const { UserService} = require('../../users/app/users.service');
const { Attendance } = require('../domain/attendance.model');
const { AppError } = require('../../../shared/core/error/appError');
const { formatWorkedTime } = require('../../../shared/utils/formattedTime');

class AttendanceService {
    static async #getTodayAttendances(user_id) {
        const today = new Date().toLocaleDateString('en-CA');
        const records = await AttendanceRepository.findByUserAndDate(user_id, today);
        return records.map(r => new Attendance(r));
    }

    static #validateAttendance(attendance) {
        if (!attendance.isValidType()) {
            throw new AppError('Tipo de asistencia inválido', 400);
        };
    }

    static #calculateWorkedMinutes(records) {
        let total = 0;
        let lastCheckIn = null;

        for (const record of records) {
            if (record.isCheckIn()) {
                lastCheckIn = record.time_stamp;
            };
            if (record.isCheckOut() && lastCheckIn) {
                const diff = (record.time_stamp - lastCheckIn) / 60000;
                total += diff;
                lastCheckIn = null;
            };
        };
        return total;
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
                throw new AppError('Ya registraste tu entrada. Debes marcar salida antes de volver a ingresar.', 400);
            }
            if (last.isCheckOut() && attendance.isCheckOut()) {
                throw new AppError('Ya registraste tu salida. Debes marcar una nueva entrada antes de salir nuevamente.', 400);
            }
        }
        if (attendance.isCheckOut()) {
            if (!last|| !last.isCheckIn()) {
                throw new AppError('No tienes una entrada registrada. Debes marcar entrada antes de salir.', 400);
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

    static async getTodayHours(user_id) {
        const attendance = await this.#getTodayAttendances(user_id);
        const minutes = this.#calculateWorkedMinutes(attendance);
        const formattedTime  = formatWorkedTime(minutes);

        return {
            user_id,
            total_minutes: minutes,
            ...formattedTime
        };
    }

    static async getTodayStatus(user_id){
        const attendance = await this.#getTodayAttendances(user_id);

        const hasCheckIn = attendance.some(a => a.isCheckIn());
        const hasCheckOut = attendance.some(a => a.isCheckOut());

        const last = attendance[attendance.length -1];
        return{
            hasCheckIn,
            hasCheckOut,
            lastType: last?.type || null
        };
    }

    static buildShifts(records) {
        const result = {};
        for (const r of records) {
            const key = r.user_id;
            if (!result[key]) {
                result[key] = {
                    dni: r.dni,
                    name: r.name,
                    shifts: []
                };
            }
            const user = result[key];
            if (r.type === 'check_in') {
                user.shifts.push({
                    date: r.time_stamp.toISOString().split('T')[0],
                    entry: r.time_stamp,
                    exit: null
                });
            }
            if (r.type === 'check_out') {
                const lastShift = user.shifts.findLast(s => !s.exit);
                if (lastShift) lastShift.exit = r.time_stamp;
            }
        }
        return result;
    }

    static toExcelRows(shiftsByUser) {
        const rows = [];
        for (const userId in shiftsByUser) {
            const user = shiftsByUser[userId];
            user.shifts.forEach(s => {
                rows.push({
                    dni: user.dni,
                    name: user.name,
                    date: s.date,
                    entry: s.entry?.toTimeString().slice(0,5),
                    exit: s.exit?.toTimeString().slice(0,5) || ''
                });
            });
        }
        return rows;
    }

    static async exportByUser(dni, startDate, endDate) {
        const records = await AttendanceRepository.findByUserAndRange(
            dni,
            startDate,
            endDate
        );
        const shifts = this.buildShifts(records);
        return this.toExcelRows(shifts);
    }

    static async exportAll(startDate, endDate) {
        const records = await AttendanceRepository.findAllByRange(
            startDate,
            endDate
        );
        const shifts = this.buildShifts(records);
        return this.toExcelRows(shifts);
    }
}

module.exports = { AttendanceService };