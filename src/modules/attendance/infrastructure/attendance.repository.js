const pool = require('../../../shared/infrastructure/database');

class AttendanceRepository {

    static async findByUserAndDate(user_id, date) {
        const [rows] = await pool.query(
            `SELECT user_id, type, time_stamp
             FROM attendance_records
             WHERE user_id = ?
             AND DATE(time_stamp) = ?
             ORDER BY time_stamp ASC`,
            [user_id, date]
        );
        return rows;
    }

    static async findLastByUserId(user_id) {
        const [rows] = await pool.query(
            `SELECT user_id, type, time_stamp
             FROM attendance_records
             WHERE user_id = ?
             ORDER BY time_stamp DESC
             LIMIT 1`,
            [user_id]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const { user_id, type, entered_code } = data;

        const [result] = await pool.query(
            `INSERT INTO attendance_records (user_id, type, time_stamp, entered_code)
             VALUES (?, ?, NOW(), ?)`,
            [user_id, type, entered_code]
        );

        return result.insertId;
    }
}

module.exports = { AttendanceRepository };