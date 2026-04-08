function validateId(paramName = 'id') {
    return (req, res, next) => {
        const value = req.params[paramName];

        if (!value || !/^\d+$/.test(value)) {
            return res.status(400).json({
                error: `El parámetro '${paramName}' debe ser un número entero válido`
            });
        }

        req.params[paramName] = Number(value);
        next();
    };
}

module.exports = { validateId };