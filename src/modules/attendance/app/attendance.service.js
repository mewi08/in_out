const { AttendanceRepository } = require('../infrastructure/attendance.repository');
const { UserService} = require('../../users/app/users.service');
const { Attendance } = require('../domain/attendance.model');
const { AppError } = require('../../../shared/utils/appError');
const { formatWorkedTime } = require('../../../shared/utils/formattedTime');

class AttendanceService {
    static async #getTodayAttendances(user_id) {
        const today = new Date().toISOString().slice(0, 10);

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

        const user = await UserService.getByCode(attendance.entered_code);
        
        attendance.user_id = user.id;
        const todayRecords = await this.#getTodayAttendances(user.id);

        const last = todayRecords[todayRecords.length - 1];

        if (last) {
            if (last.isCheckIn() && attendance.isCheckIn()) {
                throw new AppError('Ya existe un check-in sin check-out', 400);
            }

            if (last.isCheckOut() && attendance.isCheckOut()) {
                throw new AppError('No puedes hacer check-out dos veces seguidas', 400);
            }
        }

        if (attendance.isCheckOut()) {
            if (!last|| !last.isCheckIn()) {
                throw new AppError('No hay entrada pendiente para cerrar', 400);
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
}

module.exports = { AttendanceService };