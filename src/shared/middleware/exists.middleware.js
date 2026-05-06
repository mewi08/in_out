const pool = require('../infrastructure/database');
const { Response } = require('../core/http/response');
function verifyExists(table, paramName = 'id') {
    return async (req, res, next) => {
        const id = req.params[paramName];

        const [rows] = await pool.query(
            `SELECT 1 FROM ${table} WHERE id = ? LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return Response.sendNotFound(res, `Recurso no encontrado en '${table}'`);
        }

        next();
    };
}

module.exports = { verifyExists };