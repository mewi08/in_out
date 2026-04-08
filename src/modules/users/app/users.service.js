const { UserRepository } = require('../infrastructure/users.repository');
const { User } = require('../domain/users.model');
class UserService {

    static #ensureCode(entered_code) {
        if (!entered_code) {
            throw { status: 400, message: 'El DNI es obligatorio' };
        }
        return entered_code;
    };

    static async #findByCodeOrNull(entered_code){
        entered_code = this.#ensureCode(entered_code);
        return await UserRepository.findByCode(entered_code);
    };

    static async #validateUserExists(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw { status: 404, message: 'Usuario no encontrado' };
        };
        return user;
    };

    static async #validateCodeNotExists(entered_code, excludeId = null) {
        const existingUser = await this.#findByCodeOrNull(entered_code);
        
        if (existingUser && existingUser.id !== excludeId) {
            throw { status: 409, message: 'El DNI ya está registrado en el sistema' };
        };
        
        return existingUser;
    };

    static async #validateCodeExists(entered_code) {
        const user = await this.#findByCodeOrNull(entered_code);
        if (!user) {
            throw { status: 404, message: 'DNI no encontrado o usuario inactivo' };
        };
        return user;
    };

    // ── Métodos públicos ─────────────────────────────

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
            throw { status: 400, message: 'Datos inválidos' };
        }
        const user = new User(data);
        if(!user.isValidCode()){
            throw { status: 400, message: 'DNI inválido'};
        }

        await this.#validateCodeNotExists(user.entered_code);
        
        const userId = await UserRepository.create(user.toJSON());
        return await UserRepository.findById(userId);
    };

    static async update(id, data) {
        await this.#validateUserExists(id);

        if (!data) {
            throw { status: 400, message: 'Datos inválidos para actualizar' };
        };
        
        const user = new User(data);
        if (user.entered_code) {
            if(!user.isValidCode()){
                throw { status: 400, message: 'DNI inválido'};
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
            throw { status: 400, message: 'No se pudo actualizar el estado' };
        }
        return { 
            id, 
            is_active, 
            message: `Usuario ${is_active ? 'activado' : 'desactivado'}` 
        };
    };
}

module.exports = { UserService };