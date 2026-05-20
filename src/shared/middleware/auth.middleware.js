const jwt = require("jsonwebtoken");
const { AppError } = require("../core/error/appError");
const { AuthService } = require("../../modules/auth/app/auth.service");
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Token requerido", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AuthService.validateAuthenticatedUser(decoded.id);
        req.user = user;
        next();
    } catch (error) {

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Token inválido", 401));
        }

        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError("Token expirado", 401));
        }
        next(error);
    }
}

function requireAdmin(req, res, next) {
    try{
        if (req.user.role !== 'admin') {
        throw new AppError("No autorizado", 403);
    }
    next();
    }catch(error){
        next(error);
    }
}

module.exports = { authMiddleware, requireAdmin };