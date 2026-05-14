const { UserService } = require('./app/users.service');
const { Response } = require('../../shared/core/http/response');
const { AppError } = require('../../shared/core/error/appError');
const { logger } = require('../../shared/infrastructure/logger');
const { ActivityLogService } = require('../activity_log/app/activity_log.service');
async function getAdminUsers(req, res, next) {
    try {
        const filters = {
            is_active: req.query.status !== undefined
                ? Number(req.query.status)
                : undefined,
            work_area_id: req.query.work_area_id  || undefined,
            category: req.query.category || undefined,
            role: req.query.role || undefined,
            search: req.query.search || undefined,
            page: req.query.page || 1
        };

        const users = await UserService.getUsers(filters);
        return Response.sendSuccess(res, users);
    } catch (error) {
        next(error);
    }
}

async function getPublicUsers(req, res, next) {
    try{
        const filters = {
            is_active: 1, 
            search: req.query.search || undefined,
            work_area_id: req.query.work_area_id  || undefined,
            category: req.query.category || undefined,
            page: req.query.page || 1
        };

        const users = await UserService.getUsers(filters);
        const safeUsers = users.map(u => ({
            name: u.name,
            last_name: u.last_name,
            dni: u.dni,
            category: u.category,
            work_area_id: u.work_area_id,
            code: u.code
        }));
        return Response.sendSuccess(res, safeUsers);
    } catch (error) {
        next(error);
    };
}

async function getStats(req, res, next) {
    try {
        const stats = await UserService.getStats();
        return Response.sendSuccess(res, stats);
    } catch (error) {
        next(error);
    };
}

async function getById(req, res, next) {
    try {
        const user = await UserService.getById(req.params.id);
        return Response.sendSuccess(res, user);
    } catch (error) {
        next(error);
    };
}

async function getByCode(req, res, next) {
    try{
        const user = await UserService.getByCodeActive(req.params.code);
        return Response.sendSuccess(res, user);
    }catch(error){
        next(error);
    };
}

async function create(req, res, next) {
    try {
        const user = await UserService.create(req.body);
        logger.info(`Usuario creado: ${user.dni}`);
        await ActivityLogService.create({
            user_id: req.user.id,
            action: 'CREATE_USER',
            description: `Usuario creado: ${user.dni}`
        });
        return Response.sendCreated(res, user);
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const user = await UserService.update(
            req.params.id,
            req.body
        );
        logger.info(`Usuario actualizado: ${req.params.id}`);
        await ActivityLogService.create({
            user_id: req.user.id,
            action: 'UPDATE_USER',
            description: `Usuario actualizado: ${user.dni}`
        });
        return Response.sendSuccess(res, user);
    } catch (error) {
        next(error);
    }
}

async function updateStatus(req, res, next) {
    try {
        const { is_active } = req.body;
        const user =
            await UserService.updateStatus(
                req.params.id,
                is_active
            );
        await ActivityLogService.create({
            user_id: req.user.id,
            action: 'UPDATE_STATUS',
            description:
                `Usuario ${user.dni} fue ${
                    is_active
                        ? 'activado'
                        : 'desactivado'
                }`
        });
        logger.info(
            `Estado usuario actualizado: ${req.params.id} -> ${is_active}`
        );
        return Response.sendSuccess(res, user);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAdminUsers,
    getPublicUsers,
    getStats,
    getById,
    getByCode,
    create,
    update,
    updateStatus
};