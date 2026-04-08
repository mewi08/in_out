const pool = require('../infrastructure/database');

function verifyExists(table, paramName = 'id') {
    return async (req, res, next) => {
        const id = req.params[paramName];

        const [rows] = await pool.query(
            `SELECT 1 FROM ${table} WHERE id = ? LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: `Recurso no encontrado en '${table}'`
            });
        }

        next();
    };
}

module.exports = { verifyExists };