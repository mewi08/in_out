const pool = require('../../../shared/infrastructure/database');
class UserRepository{
    
    static async findAll(){
        const [rows] = await pool.query(
            `SELECT id, name, last_name, dni, category, work_area, code, is_active, created_at
            FROM users
            ORDER BY created_at DESC`
        );
        return rows;
    };

    static async findById(id){
        const [rows] = await pool.query(
            `SELECT id, name, last_name, dni, category, work_area, code, is_active
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
            WHERE dni = ? AND is_active = TRUE`,
            [dni]
        );
        return rows[0] || null;
    }

    static async findByCode(code){
        const [rows] = await pool.query(
            `SELECT id, name, last_name, dni, category, work_area, code, is_active
            FROM users
            WHERE code = ? AND is_active = TRUE`,
            [Number(code)]
        );
        return rows[0] || null;
    }

    static async create(data) {
        const {
            name, last_name, dni, category, work_area, code
        } = data;

        const [result] = await pool.query(
            `INSERT INTO users (
                name, last_name, dni, category, work_area, code
            ) VALUES (?,?,?,?,?,?)`,
            [name, last_name, dni, category, work_area, code]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const {
            name, last_name, dni, category, work_area, code
        } = data;

        const [result] = await pool.query(
            `UPDATE users SET 
                name = ?, last_name = ?, dni = ?, category = ?, work_area = ?, code = ?, updated_at = NOW()
            WHERE id = ?`,
            [
                name, last_name, dni, category, work_area, code, id
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