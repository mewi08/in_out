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
        const status =
            error.statusCode ||
            error.status ||
            500;
        let message =
            error.message ||
            'Error interno del servidor';
        if (
            process.env.NODE_ENV === 'production' &&
            status === 500
        ) {
            message = 'Error interno del servidor';
        }
        return res.status(status).json({
            success: false,
            message
        });
    }

}

module.exports = { Response };