const z = require('zod');


const userSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Nombre requerido'),

    last_name: z
        .string()
        .trim()
        .min(1, 'Apellidos requeridos'),

    dni: z
        .string()
        .trim()
        .regex(/^\d{8}$/, 'DNI debe tener 8 dígitos numéricos'),

    category: z
        .string()
        .trim()
        .min(1, 'Categoría requerida'),

    work_area: z
        .string()
        .trim()
        .min(1, 'Área de trabajo requerida'),

    code: z
        .string()
        .trim()
        .min(1, 'Código requerido'),

    role: z
        .string()
        .trim()
        .min(1, 'Rol requerido')
});


const statusSchema = z.object({
    is_active: z.boolean({
        required_error: 'is_active es requerido',
        invalid_type_error: 'is_active debe ser booleano'
    })
});


module.exports = { userSchema, statusSchema };