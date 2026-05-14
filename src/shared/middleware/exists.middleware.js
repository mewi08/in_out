const pool = require('../infrastructure/database');
const { AppError } = require('../core/error/appError');

const ALLOWED_TABLES = {
    users: 'users',
    attendance_records: 'attendance_records'
};

function verifyExists(table, paramName = 'id') {
    const safeTable = ALLOWED_TABLES[table];
    if (!safeTable) {
        throw new AppError('Configuración inválida del middleware', 500);
    }
    return async (req, res, next) => {
        const id = req.params[paramName];
        const [rows] = await pool.query(
            `SELECT 1 FROM ${safeTable} WHERE id = ? LIMIT 1`,
            [id]
        );
        if (rows.length === 0) {
            return next(
                new AppError(
                    `Recurso no encontrado en '${safeTable}'`,
                    404
                )
            );
        }
        next();
    };
}

module.exports = { verifyExists };