const pool = require('../../../shared/infrastructure/database');

class WorkAreaRepository {
    static async find(filters = {}) {
        let query = `
            SELECT
                wa.id,
                wa.name,
                wa.is_active,
                wa.created_at,
                COUNT(u.id) AS total_users
            FROM work_area wa
            LEFT JOIN users u
                ON wa.id = u.work_area_id
            WHERE 1=1
        `;

        const params = [];
        if (filters.is_active !== undefined) {
            query += ` AND wa.is_active = ?`;
            params.push(Number(filters.is_active));
        }

        if (filters.search) {
            query += ` AND wa.name LIKE ?`;
            params.push(`%${filters.search}%`);
        }

        query += `
            GROUP BY wa.id
            ORDER BY wa.created_at DESC
        `;

        const page = parseInt(filters.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const [rows] = await pool.query(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT
                wa.id,
                wa.name,
                wa.is_active,
                wa.created_at,
                COUNT(u.id) AS total_users
            FROM work_area wa
            LEFT JOIN users u
                ON wa.id = u.work_area_id
            WHERE wa.id = ?
            GROUP BY wa.id
            `,
            [id]
        );

        return rows[0] || null;
    }

    static async findByName(name) {
        const [rows] = await pool.query(
            `
            SELECT
                id,
                name,
                is_active
            FROM work_area
            WHERE name = ?
            `,
            [name]
        );

        return rows[0] || null;
    }

    static async create(data) {
        const { name } = data;
        const [result] = await pool.query(
            `INSERT INTO work_area 
                (name) 
            VALUES (?)`,
            [name]
        );

        return result.insertId;
    }

    static async update(id, data) {
        const { name } = data;
        const [result] = await pool.query(
            `UPDATE work_area SET
                name = ?,
                updated_at = NOW()
            WHERE id = ?`,
            [name, id]
        );

        return result.affectedRows;
    }

    static async updateStatus(id, is_active) {
        const [result] = await pool.query(
            `UPDATE work_area
            SET
                is_active = ?,
                updated_at = NOW()
            WHERE id = ?`,
            [is_active, id]
        );

        return result.affectedRows;
    }
}

module.exports = { WorkAreaRepository };