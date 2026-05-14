const z = require('zod');

const statusSchema = z.object({
    is_active: z.boolean({
        required_error: 'is_active es requerido',
        invalid_type_error: 'is_active debe ser booleano'
    }).optional()
});

module.exports = { statusSchema };