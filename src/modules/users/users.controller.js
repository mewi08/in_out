const { UserService } = require('./app/users.service');
const { Response } = require('../../shared/utils/response');
const logger = require('../../shared/utils/logger');

async function getAll(req, res) {
    try {
        const users = await UserService.getAll();
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

async function getByCode(req, res) {
    try {
        const user = await UserService.getByCode(req.params.entered_code);
        return Response.sendSuccess(res, user);
    } catch (error) {
        logger.error(`Error en getByCode user (${req.params.entered_code})`, error);
        return Response.sendError(res, error);
    };
};

async function create(req, res) {
    try {
        const user = await UserService.create(req.body);
        logger.info(`Usuario creado: ${user.entered_code}`);
        return Response.sendCreated(res, user); 
    } catch (error) {
        logger.error('Error en create user', error);
        return Response.sendError(res, error);
    };
};

async function update(req, res) {
    try {
        const user = await UserService.update(req.params.id, req.body);
        logger.info(`Usuario actualizado: ${req.params.id}`, { body: req.body });
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


async function verifySecurityCode(req, res) {
    try{
        const { security_code } = req.body;
        const isCorrect = await UserService.verifySecurityCode(security_code);
        return Response.sendSuccess(res, {valid: isCorrect});
    }catch(error){
        logger.error('Error al verificar código de seguridad', error);
        return Response.sendError(res, error);
    };
};

module.exports = {
    getAll,
    getById,
    getByCode,
    create,
    update,
    updateStatus,
    verifySecurityCode
};