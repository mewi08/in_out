const { UserRepository } = require('../infrastructure/users.repository');
const { User } = require('../domain/users.model');
const { AppError } = require('../../../shared/utils/appError');
require('dotenv').config();
class UserService {

    static #ensureCode(entered_code) {
        if (!entered_code) {
            throw new AppError('El DNI es obligatorio', 400);
        }
        return entered_code;
    };

    static async #findByCodeOrNull(entered_code) {
        entered_code = this.#ensureCode(entered_code);
        return await UserRepository.findByCode(entered_code);
    };

    static async #validateUserExists(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    };

    static async #validateCodeNotExists(entered_code, excludeId = null) {
        const existingUser = await this.#findByCodeOrNull(entered_code);

        if (existingUser && existingUser.id !== excludeId) {
            throw new AppError('El DNI ya está registrado en el sistema', 409);
        }

        return existingUser;
    };

    static async #validateCodeExists(entered_code) {
        const user = await this.#findByCodeOrNull(entered_code);
        if (!user) {
            throw new AppError('DNI no encontrado o usuario inactivo', 404);
        }
        return user;
    };

    // ── public methods ─────────────────────────────

    static async getAll() {
        return await UserRepository.findAll();
    };

    static async getById(id) {
        return await this.#validateUserExists(id);
    };

    static async getByCode(entered_code) {
        return await this.#validateCodeExists(entered_code);
    };

    static async create(data) {
        if (!data) {
            throw new AppError('Datos inválidos', 400);
        }

        const user = new User(data);

        if (!user.isValidCode()) {
            throw new AppError('DNI inválido', 400);
        };

        await this.#validateCodeNotExists(user.entered_code);

        const userId = await UserRepository.create(user.toJSON());
        return await UserRepository.findById(userId);
    };

    static async update(id, data) {
        await this.#validateUserExists(id);

        if (!data) {
            throw new AppError('Datos inválidos para actualizar', 400);
        };

        const user = new User(data);

        if (user.entered_code) {
            if (!user.isValidCode()) {
                throw new AppError('DNI inválido', 400);
            };

            await this.#validateCodeNotExists(user.entered_code, id);
        };

        await UserRepository.update(id, user.toJSON());
        return await UserRepository.findById(id);
    };

    static async updateStatus(id, is_active) {
        await this.#validateUserExists(id);

        const affected = await UserRepository.updateStatus(id, is_active);

        if (!affected) {
            throw new AppError('No se pudo actualizar el estado', 400);
        };

        return {
            id,
            is_active,
            message: `Usuario ${is_active ? 'activado' : 'desactivado'}`
        };
    };

    static async verifySecurityCode(security_code) {
        const validCode = process.env.SECURITY_CODE;

        if(!validCode){
            throw new Error('Código de seguridad no configurado');
        }

        return security_code === validCode;
    }
}

module.exports = { UserService };