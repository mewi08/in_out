const jwt = require('jsonwebtoken');
const { Response } = require('../../shared/utils/response');
const pool = require('../../shared/infrastructure/database');
const logger = require('../../shared/utils/logger');
const { AppError } = require('../../shared/utils/appError');

async function login(req, res) {
    try{
        const { code } = req.body;

        if(!code){
            throw new AppError('El código es requerido', 400)
        }

        // Buscar usuario
        const [rows] = await pool.query(`
            SELECT id, name, last_name, role, is_active
            FROM users
            WHERE code = ? AND is_active = 1`, 
            [code]
        );

        const user = rows[0];

        if (!user) {
            throw new AppError('Código inválido o usuario inactivo', 404);
        }

        if(user.role !== 'admin'){
            throw new AppError('Acceso denegado', 403);
        }

        // Generar JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                name: `${user.name} ${user.last_name}`
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            success: true,
            token,
            user
        });

    }catch(error){
        logger.error('Error en login', error)
        return Response.sendError(res, error);
    }
}

module.exports = { login };