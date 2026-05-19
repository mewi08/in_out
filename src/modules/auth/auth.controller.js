const jwt = require('jsonwebtoken');
const { Response } = require('../../shared/core/http/response');
const pool = require('../../shared/infrastructure/database');
const {logger, logError} = require('../../shared/infrastructure/logger');
const { AppError } = require('../../shared/core/error/appError');
const { ActivityLogService } = require('../activity_log/app/activity_log.service');
async function login(req, res, next) {
    try{
        const { code } = req.body;

        if(!code){
            throw new AppError('El código es requerido', 400)
        }

        // Buscar usuario
        const [rows] = await pool.query(`
            SELECT id, name, last_name, role, is_active
            FROM users
            WHERE code = ?`, 
            [code]
        );

        const user = rows[0];

        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        if(!user.is_active){
            throw new AppError('Usuario inactivo', 403);
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
        await ActivityLogService.create({
            user_id: user.id,
            action: 'Login',
            description: `El usuario (${user.name} ${user.last_name}) inició sesión`
        });
        return Response.sendSuccess(res, {
            token,
            user: {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                role: user.role
            }
        });

    }catch(error){
        next(error);
    }
}

module.exports = { login };