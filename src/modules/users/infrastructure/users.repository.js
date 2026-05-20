const pool = require('../../../shared/infrastructure/database');
class UserRepository{
    
    static async find(filters = {}) {

        let query = `
            SELECT 
                u.id,
                u.name,
                u.last_name,
                u.dni,
                u.category,
                u.work_area_id,
                wa.name AS work_area,
                u.role,
                u.code,
                u.is_active,
                u.created_at
            FROM users u
            LEFT JOIN work_area wa ON u.work_area_id = wa.id
            WHERE 1=1
        `;

        const params = [];
        
        if (filters.is_active !== undefined) {
            query += ` AND u.is_active = ?`;
            params.push(Number(filters.is_active));
        }

        if (filters.only_active_work_area) {
            query += ` AND wa.is_active = 1`;
        }

        if (filters.work_area_id) {
            query += ` AND u.work_area_id = ?`;
            params.push(Number(filters.work_area_id));
        }

        if (filters.category) {
            query += ` AND u.category = ?`;
            params.push(filters.category);
        }

        if (filters.role) {
            query += ` AND u.role = ?`;
            params.push(filters.role);
        }

        if (filters.search) {
            query += `
                AND (
                    u.name LIKE ?
                    OR u.last_name LIKE ?
                    OR u.dni LIKE ?
                )
            `;
            params.push(
                `%${filters.search}%`,
                `%${filters.search}%`,
                `%${filters.search}%`
            );
        }
        query += ` ORDER BY u.created_at DESC`;

        // PAGINACIÓN
        const page =
            parseInt(filters.page) || 1;
        const limit = 6;
        const offset =
            (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const [rows] =
            await pool.query(query, params);
        return rows;
    };

    static async getStats(){
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS actives,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactives,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
                SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) AS users
            FROM users`
        );
        return rows;
    };

    static async findById(id){
        const [rows] = await pool.query(
            `SELECT u.id, u.name, u.last_name, u.dni, u.category, u.work_area_id, wa.name AS work_area, u.code, u.role, u.is_active
            FROM users u
            INNER JOIN work_area wa ON u.work_area_id = wa.id
            WHERE u.id = ? `,
            [id]
        );
        return rows[0] || null; 
    };

    static async findByDni(dni){
        const [rows] = await pool.query(
            `SELECT u.id, u.name, u.last_name, u.dni, u.category, u.work_area_id, wa.name AS work_area, u.code, u.is_active
            FROM users u
            INNER JOIN work_area wa ON u.work_area_id = wa.id
            WHERE u.dni = ?`,
            [dni]
        );
        return rows[0] || null;
    }

    static async findByCode(code){
        const [rows] = await pool.query(
            `SELECT u.id, u.name, u.last_name, u.dni, u.category, u.work_area_id, wa.name AS work_area, u.code, u.is_active
            FROM users u
            INNER JOIN work_area wa ON u.work_area_id = wa.id
            WHERE u.code = ?`,
            [code]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const {
            name, last_name, dni, category, work_area_id, code, role
        } = data;

        const [result] = await pool.query(
            `INSERT INTO users (
                name, last_name, dni, category, work_area_id, code, role
            ) VALUES (?,?,?,?,?,?,?)`,
            [name, last_name, dni, category, work_area_id, code, role]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const {
            name, last_name, dni, category, work_area_id, code, role
        } = data;

        const [result] = await pool.query(
            `UPDATE users SET 
                name = ?, last_name = ?, dni = ?, category = ?, work_area_id = ?, code = ?, role = ?, updated_at = NOW()
            WHERE id = ?`,
            [
                name, last_name, dni, category, work_area_id, code, role, id
            ]
        );
        return result.affectedRows;
    };

    static async updateStatus(id, is_active){
        const [result] = await pool.query(
            `UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?`,
            [is_active, id]
        );
        return result.affectedRows;
    }
}
module.exports = { UserRepository };