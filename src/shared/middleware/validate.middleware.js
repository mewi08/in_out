const { AppError } = require('../core/error/appError');

function validate(schema, source = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const firstError =
                result.error.issues[0].message;
            return next(
                new AppError(firstError, 400)
            );
        }
        req[source] = result.data;
        next();
    };
}

module.exports = { validate };