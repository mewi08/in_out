const { AppError } = require('../core/error/appError');

function validate(schema) {

    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const firstError =
                result.error.issues[0].message;
            return next(
                new AppError(firstError, 400)
            );
        }
        req.body = result.data;
        next();
    };
}

module.exports = { validate };