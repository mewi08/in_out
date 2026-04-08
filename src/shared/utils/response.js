class Response {
    
    static sendSuccess(res, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data
        });
    }

    static sendCreated(res, data) {
        return this.sendSuccess(res, data, 201);
    }

    static sendError(res, error) {
        const status = error.status || 500;
        const message = error.message || 'Error interno del servidor';
        return res.status(status).json({
            success: false,
            error: message
        });
    }

    static sendNotFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            success: false,
            error: message
        });
    }

    static sendUnauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            success: false,
            error: message
        });
    }

    static sendValidationError(res, errors) {
        return res.status(400).json({
            success: false,
            errors: Array.isArray(errors) ? errors : [errors]
        });
    }

    static sendBadRequest(res, message = 'Solicitud inválida') {
        return res.status(400).json({
            success: false,
            error: message
        });
    }
}

module.exports = { Response };