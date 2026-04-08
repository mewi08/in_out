function validateAttendance(req, res, next) {
    if (!req.body) {
        return res.status(400).json({ errors: ['Body requerido'] });
    }

    let { entered_code, type } = req.body;

    const errors = [];

    if (!entered_code || !/^\d{8}$/.test(entered_code.trim())) {
        errors.push('Código debe tener 8 dígitos numéricos');
    }

    if (!type || type.trim() === '') {
        errors.push('Tipo de asistencia requerido');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.entered_code = entered_code.trim();
    req.body.type = type.trim();

    next();
}

module.exports = { validateAttendance };