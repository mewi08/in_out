const { WorkAreaService } = require('./app/work_area.service');
const { Response } = require('../../shared/core/http/response');
const { logger } = require('../../shared/infrastructure/logger');

class WorkAreaController {

    static async getAll(req, res, next) {
        try {
            const filters = {
                is_active: req.query.status !== undefined
                    ? Number(req.query.status)
                    : undefined,
                search: req.query.search || undefined,
                page: req.query.page || 1
            };
            const areas = await WorkAreaService.getAll(filters);
            return Response.sendSuccess(res, areas);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const area =
                await WorkAreaService.getById(
                    req.params.id
                );
            return Response.sendSuccess(res, area);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const area =
                await WorkAreaService.create(
                    req.body
                );
            logger.info(
                `Área creada: ${area.name} (ID: ${area.id})`
            );
            return Response.sendCreated(res, area);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const area =
                await WorkAreaService.update(
                    req.params.id,
                    req.body
                );
            logger.info(
                `Área actualizada: ${area.name} (ID: ${area.id})`
            );
            return Response.sendSuccess(res, area);
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { is_active } = req.body;
            const area =
                await WorkAreaService.updateStatus(
                    req.params.id,
                    is_active
                );
            logger.info(
                `Estado de área actualizado: ID ${area.id} -> ${is_active}`
            );
            return Response.sendSuccess(res, area);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { WorkAreaController };