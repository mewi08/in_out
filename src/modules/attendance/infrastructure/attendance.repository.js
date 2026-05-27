const pool = require('../../../shared/infrastructure/database');

class AttendanceRepository {

    static async findAttendanceReport(limit, offset) {
        const [rows] = await pool.query(
            `SELECT 
                u.dni,
                u.name,
                u.last_name,
                DATE(ar.time_stamp) AS date,
                MAX(CASE WHEN ar.type = 'check_in' THEN TIME(ar.time_stamp) END) AS entrada,
                MAX(CASE WHEN ar.type = 'check_out' THEN TIME(ar.time_stamp) END) AS salida
            FROM attendance_records ar
            INNER JOIN users u ON ar.user_id = u.id
            GROUP BY u.id, u.dni, u.name, u.last_name, DATE(ar.time_stamp)
            ORDER BY date DESC, u.dni ASC
            LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        return rows;
    }

    static async findByUserAndRange(user_id, startDate, endDate) {
        const [rows] = await pool.query(
            `SELECT 
                u.id as user_id,
                u.dni,
                u.name,
                u.last_name,
                ar.type,
                ar.time_stamp
            FROM attendance_records ar
            INNER JOIN users u ON ar.user_id = u.id
            WHERE u.id = ?
            AND ar.time_stamp >= ?
            AND ar.time_stamp < DATE_ADD(?, INTERVAL 1 DAY)
            ORDER BY ar.time_stamp ASC`,
            [user_id, startDate, endDate]
        );
        return rows;
    }

    static async findAllByRange(startDate, endDate) {
        const [rows] = await pool.query(
            `SELECT 
                u.id AS user_id,
                u.dni,
                u.name,
                u.last_name,
                wa.name AS work_area,
                ar.type,
                ar.time_stamp
            FROM attendance_records ar
            INNER JOIN users u ON ar.user_id = u.id
            INNER JOIN work_area wa ON wa.id = u.work_area_id
            WHERE ar.time_stamp >= ?
            AND ar.time_stamp < DATE_ADD(?, INTERVAL 1 DAY)
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

    static async create(data) {
        const { user_id, type, time_stamp } = data;

        const [result] = await pool.query(
            `INSERT INTO attendance_records (user_id, type, time_stamp)
             VALUES (?, ?, ?)`,
            [user_id, type, time_stamp]
        );

        return result.insertId;
    }
}

module.exports = { AttendanceRepository };