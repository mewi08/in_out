const { AppError } = require('../core/error/appError');

function validateId(paramName = 'id') {
    return (req, res, next) => {
        const value = req.params[paramName];
        if (!value || !/^\d+$/.test(value)) {
            return next(
                new AppError(
                    `El parámetro '${paramName}' debe ser un número entero válido`,
                    400
                )
            );
        }
        req.params[paramName] = Number(value);
        next();
    };
}

module.exports = { validateId };