const z = require('zod');
const { statusSchema } = require('../../../shared/utils/validator/status.schema');

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

    work_area_id: z.coerce
        .number({
            required_error: 'Área de trabajo requerida'
        })
        .int()
        .positive(),

    code: z
        .string()
        .trim()
        .min(1, 'Código requerido'),

    role: z.enum(['admin', 'employee'])
});

const updateStatusSchema = statusSchema;

module.exports = { userSchema, updateStatusSchema };