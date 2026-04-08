const { AttendanceRepository } = require('../infrastructure/attendance.repository');
const { UserRepository} = require('../../users/infrastructure/users.repository')
const { Attendance } = require('../domain/attendance.model');
const { formatWorkedTime } = require('../../../shared/utils/formattedTime ');

class AttendanceService {


    static #validateAttendance(attendance) {
        if (!attendance.isValidType()) {
            throw { status: 400, message: 'Tipo de asistencia inválido' };
        }
    }

    static #calculateWorkedMinutes(records) {
        let total = 0;
        let lastCheckIn = null;

        for (const record of records) {
            if (record.isCheckIn()) {
                lastCheckIn = record.time_stamp;
            }

            if (record.isCheckOut() && lastCheckIn) {
                const diff = (record.time_stamp - lastCheckIn) / 60000;
                total += diff;
                lastCheckIn = null;
            }
        }

        return total;
    }

    // 🔹 registrar asistencia
    static async register(data) {
        const attendance = new Attendance(data);

        this.#validateAttendance(attendance);

        const user = await UserRepository.findByCode(attendance.entered_code);
        
        const last = await AttendanceRepository.findLastByUserId(attendance.user_id);

        attendance.user_id = user.id;
        if (last) {
            const lastRecord = new Attendance(last);

            if (lastRecord.isCheckIn() && attendance.isCheckIn()) {
                throw { status: 400, message: 'Ya existe un check-in sin check-out' };
            }
        }

        const id = await AttendanceRepository.create(attendance.toJSON());

        return {
            id,
            message: attendance.isCheckIn() ? 'Entrada registrada' : 'Salida registrada'
        };
    }

    // 🔹 horas trabajadas hoy
    static async getTodayHours(user_id) {
        const today = new Date().toISOString().slice(0, 10);

        const rows = await AttendanceRepository.findByUserAndDate(user_id, today);

        const records = rows.map(r => new Attendance(r));

        const minutes = this.#calculateWorkedMinutes(records);

        const formattedTime  = formatWorkedTime(minutes);

        return {
            user_id,
            total_minutes: minutes,
            ...formattedTime
        };
    }
}

module.exports = { AttendanceService };