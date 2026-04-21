function validateAttendance(req, res, next) {
    if (!req.body) {
        return res.status(400).json({ errors: ['Body requerido'] });
    }

    let { code, type } = req.body;

    const errors = [];

    if (!code) {
        errors.push('Código requerido');
    }

    if (!type || type.trim() === '') {
        errors.push('Tipo de asistencia requerido');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.code = code.trim();
    req.body.type = type.trim();

    next();
}

module.exports = { validateAttendance };