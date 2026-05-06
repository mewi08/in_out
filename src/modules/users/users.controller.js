const { UserService } = require('./app/users.service');
const { Response } = require('../../shared/core/http/response');
const logger = require('../../shared/infrastructure/logger');

async function getAdminUsers(req, res) {
    try {
        const filters = {
            is_active: req.query.status !== undefined
                ? Boolean(Number(req.query.status))
                : undefined,
            work_area: req.query.area || undefined,
            category: req.query.category || undefined,
            role: req.query.role || undefined,
            search: req.query.search || undefined
        };

        const users = await UserService.getUsers(filters);
        return Response.sendSuccess(res, users);
    } catch (error) {
        logger.error('Error en getAdminUsers', error);
        return Response.sendError(res, error);
    }
};

async function getPublicUsers(req, res) {
    try{
        const filters = {
            is_active: 1, 
            search: req.query.search || undefined,
            work_area: req.query.area || undefined
        };

        const users = await UserService.getUsers(filters);
        const safeUsers = users.map(u => ({
            name: u.name,
            last_name: u.last_name,
            dni: u.dni,
            category: u.category,
            work_area: u.work_area,
            code: u.code
        }));
        return Response.sendSuccess(res, safeUsers);
    } catch (error) {
        logger.error('Error en getPublicUsers', error);
        return Response.sendError(res, error);
    };
};

async function getStats(req, res) {
    try {
        const stats = await UserService.getStats();
        return Response.sendSuccess(res, stats);
    } catch (error) {
        logger.error('Error en getStats', error);
        return Response.sendError(res, error);
    };
};

async function getById(req, res) {
    try {
        const user = await UserService.getById(req.params.id);
        return Response.sendSuccess(res, user);
    } catch (error) {
        logger.error(`Error en getById user (${req.params.id})`, error);
        return Response.sendError(res, error);
    };
};

async function getByDni(req, res) {
    try {
        const user = await UserService.getByDni(req.params.dni);
        return Response.sendSuccess(res, user);
    } catch (error) {
        logger.error(`Error en getByDni user (${req.params.dni})`, error);
        return Response.sendError(res, error);
    };
};

async function getByCode(req, res) {
    try{
        const user = await UserService.getByCode(req.params.code);
        return Response.sendSuccess(res, user);
    }catch(error){
        logger.error(`Error en getByCode user (${req.params.code})`, error);
        return Response.sendError(res, error);
    };
};

async function create(req, res) {
    try {
        const user = await UserService.create(req.body);
        logger.info(`Usuario creado: ${user.dni}`);
        return Response.sendCreated(res, user); 
    } catch (error) {
        logger.error('Error en create user', error);
        return Response.sendError(res, error);
    };
};

async function update(req, res) {
    try {
        const user = await UserService.update(req.params.id, req.body);
        logger.info(`Usuario actualizado: ${req.params.id}`);
        return Response.sendSuccess(res, user);
    } catch (error) {
        logger.error(`Error en update user (${req.params.id})`, error);
        return Response.sendError(res, error);
    };
};

async function updateStatus(req, res) {
    try {
        const { is_active } = req.body;

        const user = await UserService.updateStatus(req.params.id, is_active);

        logger.info(`Estado usuario actualizado: ${req.params.id} -> ${is_active}`);
        return Response.sendSuccess(res, user);
    } catch (error) {
        logger.error(`Error en updateStatus user (${req.params.id})`, error);
        return Response.sendError(res, error);
    };
};

module.exports = {
    getAdminUsers,
    getPublicUsers,
    getStats,
    getById,
    getByDni,
    getByCode,
    create,
    update,
    updateStatus
};