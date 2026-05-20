const pool = require('../../../shared/infrastructure/database');

class AuthRepository {

    static async findUserByCode(code) {

        const [rows] = await pool.query(`
            SELECT
                id,
                name,
                last_name,
                role,
                is_active
            FROM users
            WHERE code = ?
        `, [code]);

        return rows[0];
    }

    static async findAuthUserById(id) {

        const [rows] = await pool.query(`
            SELECT
                id,
                role,
                is_active
            FROM users
            WHERE id = ?
        `, [id]);

        return rows[0];
    }
}

module.exports = { AuthRepository };