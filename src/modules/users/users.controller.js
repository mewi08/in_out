const { UserService } = require('./app/users.service');
const { Response } = require('../../shared/core/http/response');
const logger = require('../../shared/infrastructure/logger');

async function getAll(req, res) {
    try {
        const {status} = req.query;
        const users = await UserService.getAll(status);
        return Response.sendSuccess(res, users);
    } catch (error) {
        logger.error('Error en getAll users', error);
        return Response.sendError(res, error);
    };
};

async function getById(req, res) {
    try {
        if (!req.params.id) {
            return Response.sendBadRequest(res, 'ID requerido');
        }

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
    getAll,
    getById,
    getByDni,
    getByCode,
    create,
    update,
    updateStatus
};