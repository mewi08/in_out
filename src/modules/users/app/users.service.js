const { UserRepository } = require('../infrastructure/users.repository');
const { User } = require('../domain/users.model');
const { AppError } = require('../../../shared/utils/appError');
require('dotenv').config();
class UserService {

    static async #validateUserExists(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    };
    static async #validateDniExists(dni){
        const user = await UserRepository.findByDni(dni);
        if(!user){
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    };
    static async #ensureDniNotExists(dni){
        const user = await UserRepository.findByDni(dni);
        if(user){
            throw new AppError('El DNI ya está registrado', 400);
        }
    };
    static async #validateCodeExists(code){
        const user = await UserRepository.findByCode(code);
        if(!user){
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    }

    // ── public methods ─────────────────────────────

    static async getAll() {
        return await UserRepository.findAll();
    };

    static async getById(id) {
        return await this.#validateUserExists(id);
    };

    static async getByDni(dni) {
        return await this.#validateDniExists(dni);
    };

    static async create(data) {
        if (!data) {
            throw new AppError('Datos inválidos', 400);
        }
        const user = new User(data);
        await this.#ensureDniNotExists(user.dni);
        const userId = await UserRepository.create(user.toJSON());
        return await UserRepository.findById(userId);
    };

    static async update(id, data) {
        await this.#validateUserExists(id);
        if (!data) {
            throw new AppError('Datos inválidos para actualizar', 400);
        };
        if(data.dni){
            const existing = await UserRepository.findByDni(data.dni);
            if(existing && existing.id !== id){
                throw new AppError('El DNI ya está registrado', 400);
            }
        };
        const user = new User(data);
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