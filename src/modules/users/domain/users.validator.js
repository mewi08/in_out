function validateInfo(req, res, next){
    if (!req.body) {
        return res.status(400).json({ errors: ['Body requerido'] });
    }

    let {
        name, last_name, entered_code, category, work_area
    } = req.body;

    const errors = [];

    if (!name || name.trim() === '')
        errors.push('Nombre requerido');

    if (!last_name || last_name.trim() === '')
        errors.push('Apellidos requeridos');

    if (!entered_code || !/^\d{8}$/.test(entered_code.trim()))
        errors.push('DNI debe tener 8 dígitos numéricos');

    if (!category || category.trim() === '')
        errors.push('Categoría requerida');

    if(!work_area || work_area.trim() === '')
        errors.push('Area de trabajo requida');

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.name = name.trim();
    req.body.last_name = last_name.trim();
    req.body.entered_code = entered_code.trim();
    req.body.category = category.trim();
    req.body.work_area = work_area.trim();
    next();
}

function validateStatus(req, res, next){
    if (!req.body) {
        return res.status(400).json({ errors: ['Body requerido'] });
    };
    const { is_active} = req.body;

    if(is_active === undefined){
        return res.status(400).json({ message: ['is_active es requido']});
    };

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({ message: ['is_active debe ser booleano']});
    };

    next();
}
module.exports = { validateInfo, validateStatus };