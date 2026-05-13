const { UserRepository } = require('../infrastructure/users.repository');
const { User } = require('../domain/users.model');
const { AppError } = require('../../../shared/core/error/appError');

class UserService {

    static async #getUserOrFail(id) {
        const user = await UserRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404);
        return user;
    }

    static async #assertUniqueDni(dni, ignoreId = null) {
        const user = await UserRepository.findByDni(dni);
        if (user && user.id !== ignoreId) {
            throw new AppError('El DNI ya está registrado', 400);
        }
    }

    static async #assertUniqueCode(code, ignoreId = null) {
        if (!code) return;
        const user = await UserRepository.findByCode(code);
        if (user && user.id !== ignoreId) {
            throw new AppError('El código ya está registrado', 400);
        }
    }

    static getUsers(filters) {
        return UserRepository.find(filters);
    }

    static getStats() {
        return UserRepository.getStats();
    }

    static getById(id) {
        return this.#getUserOrFail(id);
    }

    static async getByCodeActive(code) {
        const user = await this.#getUserOrFailByCode(code);
        if (!user.is_active) {
            throw new AppError('Usuario inactivo', 400);
        }
        return user;
    }

    static async #getUserOrFailByCode(code) {
        const user = await UserRepository.findByCode(code);
        if (!user) throw new AppError('Usuario no encontrado', 404);
        return user;
    }

    static async create(data) {
        if (!data) {
            throw new AppError('Datos inválidos', 400);
        }
        const user = new User(data);
        await this.#assertUniqueDni(user.dni);
        await this.#assertUniqueCode(user.code);
        const id = await UserRepository.create(user.toJSON());
        return this.getById(id);
    }

    static async update(id, data) {
        await this.#getUserOrFail(id);
        if (!data) {
            throw new AppError('Datos inválidos para actualizar', 400);
        }
        if (data.dni) {
            await this.#assertUniqueDni(data.dni, id);
        }
        if (data.code) {
            await this.#assertUniqueCode(data.code, id);
        }
        const user = new User(data);
        await UserRepository.update(id, user.toJSON());
        return this.getById(id);
    }

    static async updateStatus(id, is_active) {
        const user = await this.#getUserOrFail(id);
        const affected = await UserRepository.updateStatus(id, is_active);
        if (!affected) {
            throw new AppError('No se pudo actualizar el estado', 400);
        }
        return {
            id: user.id,
            dni: user.dni,
            is_active,
            message: `Usuario ${is_active ? 'activado' : 'desactivado'}`
        };
    }
}

module.exports = { UserService };