const { Response } = require('../../shared/core/http/response');
const { AuthService } = require('../app/auth.service');

async function login(req, res, next) {
    try {
        const data = await AuthService.login(req.body.code);
        return Response.sendSuccess(res, data);
    } catch (error) {
        next(error);
    }
}

module.exports = { login };