const pool = require('../../../shared/infrastructure/database');

class ActivityLogRepository {

    static async create(data) {
        const {
            action,
            description,
            user_id
        } = data;

        const [result] = await pool.query(
            `
            INSERT INTO activity_logs (
                action,
                description,
                user_id
            )
            VALUES (?, ?, ?)
            `,
            [
                action,
                description,
                user_id
            ]
        );

        return result.insertId;
    }

    static async findRecent(limit = 10) {
        const [rows] = await pool.query(
            `
            SELECT
                al.id,
                al.action,
                al.description,
                al.created_at,
                u.name,
                u.last_name
            FROM activity_logs al
            LEFT JOIN users u
                ON u.id = al.user_id
            ORDER BY al.created_at DESC
            LIMIT ?
            `,
            [limit]
        );

        return rows;
    }
}

module.exports = { ActivityLogRepository };