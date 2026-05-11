const pool = require('../../../shared/infrastructure/database');
class UserRepository{
    
    static async find(filters = {}) {

        let query = `
            SELECT 
                id,
                name,
                last_name,
                dni,
                category,
                work_area,
                role,
                code,
                is_active,
                created_at
            FROM users
            WHERE 1=1
        `;

        const params = [];
        
        if (filters.is_active !== undefined) {
            query += ` AND is_active = ?`;
            params.push(Number(filters.is_active));
        }

        if (filters.work_area) {
            query += ` AND work_area = ?`;
            params.push(filters.work_area);
        }

        if (filters.category) {
            query += ` AND category = ?`;
            params.push(filters.category);
        }

        if (filters.role) {
            query += ` AND role = ?`;
            params.push(filters.role);
        }

        if (filters.search) {
            query += `
                AND (
                    name LIKE ?
                    OR last_name LIKE ?
                    OR dni LIKE ?
                )
            `;
            params.push(
                `%${filters.search}%`,
                `%${filters.search}%`,
                `%${filters.search}%`
            );
        }
        query += ` ORDER BY created_at DESC`;

        // PAGINACIÓN
        const page =
            parseInt(filters.page) || 1;
        const limit = 5;
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
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins,
                SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) AS employee
            FROM users`
        );
        return rows;
    };

    static async findById(id){
        const [rows] = await pool.query(
            `SELECT id, name, last_name, dni, category, work_area, code, role, is_active
            FROM users
            WHERE id = ? `,
            [id]
        );
        return rows[0] || null; 
    };

    static async findByDni(dni){
        const [rows] = await pool.query(
            `SELECT id, name, last_name, dni, category, work_area, code, is_active
            FROM users
            WHERE dni = ?`,
            [dni]
        );
        return rows[0] || null;
    }

    static async findByCode(code){
        const [rows] = await pool.query(
            `SELECT id, name, last_name, dni, category, work_area, code, is_active
            FROM users
            WHERE code = ?`,
            [code]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const {
            name, last_name, dni, category, work_area, code, role
        } = data;

        const [result] = await pool.query(
            `INSERT INTO users (
                name, last_name, dni, category, work_area, code, role
            ) VALUES (?,?,?,?,?,?,?)`,
            [name, last_name, dni, category, work_area, code, role]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const {
            name, last_name, dni, category, work_area, code, role
        } = data;

        const [result] = await pool.query(
            `UPDATE users SET 
                name = ?, last_name = ?, dni = ?, category = ?, work_area = ?, code = ?, role = ?, updated_at = NOW()
            WHERE id = ?`,
            [
                name, last_name, dni, category, work_area, code, role, id
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