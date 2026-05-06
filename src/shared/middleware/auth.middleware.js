const jwt = require('jsonwebtoken');
const { Response } = require('../core/http/response');

function authMiddleware(req, res, next){
    const authHead = req.headers.authorization;

    if(!authHead){
        return Response.sendUnauthorized(res, 'Token requerido');
    }

    const token = authHead.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return Response.sendUnauthorized(res, 'Token inválido');
    }
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return Response.sendForbidden(res, 'No autorizado');
        }
        next();
    };
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return Response.sendForbidden(res, 'No autorizado');
    }
    next();
}

module.exports = { authMiddleware, requireAdmin };