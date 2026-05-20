const jwt = require('jsonwebtoken');
const { AppError } = require('../../../shared/core/error/appError');
const { AuthRepository } = require('../infrastructure/auth.repository');
const { ActivityLogService } = require('../../activity_log/app/activity_log.service');

class AuthService {
    static async login(code) {
        if (!code) {
            throw new AppError('El código es requerido', 400);
        }

        const user = await AuthRepository.findUserByCode(code);

        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        if (!user.is_active) {
            throw new AppError('Usuario inactivo', 403);
        }

        if (user.role !== 'admin') {
            throw new AppError('Acceso denegado', 403);
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                name: `${user.name} ${user.last_name}`
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            }
        );

        await ActivityLogService.create({
            user_id: user.id,
            action: 'Login',
            description:
                `El usuario (${user.name} ${user.last_name}) inició sesión`
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                role: user.role
            }
        };
    }

    static async validateAuthenticatedUser(id) {
        const user = await AuthRepository.findAuthUserById(id);

        if (!user) {
            throw new AppError('Usuario no encontrado', 401);
        }

        if (!user.is_active) {
            throw new AppError('Usuario inactivo', 403);
        }

        return user;
    }
}

module.exports = { AuthService };