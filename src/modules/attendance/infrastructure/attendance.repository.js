const pool = require('../../../shared/infrastructure/database');

class AttendanceRepository {

    static async findByUserAndRange(dni, startDate, endDate) {
        const [rows] = await pool.query(
            `SELECT 
                u.id as user_id,
                u.dni,
                u.name,
                ar.type,
                ar.time_stamp
            FROM attendance_records ar
            INNER JOIN users u ON ar.user_id = u.id
            WHERE u.dni = ?
            AND ar.time_stamp >= ?
            AND ar.time_stamp < ?
            ORDER BY ar.time_stamp ASC`,
            [dni, startDate, endDate]
        );
        return rows;
    }

    static async findAllByRange(startDate, endDate) {
        const [rows] = await pool.query(
            `SELECT 
                u.id as user_id,
                u.dni,
                u.name,
                ar.type,
                ar.time_stamp
             FROM attendance_records ar
             INNER JOIN users u ON ar.user_id = u.id
             WHERE ar.time_stamp >= ?
             AND ar.time_stamp < ?
             ORDER BY u.id ASC, ar.time_stamp ASC`,
            [startDate, endDate]
        );
        return rows;
    }

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
        const { user_id, type } = data;

        const [result] = await pool.query(
            `INSERT INTO attendance_records (user_id, type, time_stamp)
             VALUES (?, ?, NOW())`,
            [user_id, type]
        );

        return result.insertId;
    }
}

module.exports = { AttendanceRepository };