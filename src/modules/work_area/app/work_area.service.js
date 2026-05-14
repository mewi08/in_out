const { WorkAreaRepository } = require('../infrastructure/work_area.repository');
const { AppError } = require('../../../shared/core/error/appError');

class WorkAreaService {

    static async #getAreaOrFail(id) {
        const area = await WorkAreaRepository.findById(id);
        if (!area) {
            throw new AppError('Área no encontrada', 404);
        }

        return area;
    }

    static async #assertUniqueName(name, ignoredId = null) {
        const area = await WorkAreaRepository.findByName(name);
        if (area && area.id !== ignoredId) {
            throw new AppError('El área ya está registrada', 400);
        }
    }

    static getAll(filters) {
        return WorkAreaRepository.find(filters);
    }

    static getById(id) {
        return this.#getAreaOrFail(id);
    }

    static async create(name) {
        if (!name) {
            throw new AppError('Datos inválidos', 400);
        }
        await this.#assertUniqueName(name);
        const id = await WorkAreaRepository.create(name);

        return this.getById(id);
    }

    static async update(id, name) {
        await this.#getAreaOrFail(id);
        if (!name) {
            throw new AppError('Datos inválidos para actualizar', 400);
        }

        if (name) {
            await this.#assertUniqueName(
                name,
                id
            );
        }
        await WorkAreaRepository.update(id, name);

        return this.getById(id);
    }

    static async updateStatus(id, is_active) {
        const area = await this.#getAreaOrFail(id);
        const affected = await WorkAreaRepository.updateStatus(id, is_active);
        if (!affected) {
            throw new AppError('No se pudo actualizar el estado', 400);
        }

        return {
            id: area.id,
            is_active,
            message: `Área de trabajo ${is_active? 'activada': 'desactivada'}`
        };
    }
}

module.exports = { WorkAreaService };