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
            required_error: 'Área requerida',
            invalid_type_error: 'Área inválida'
        })
        .int()
        .min(1, 'Selecciona un área válida'),

    code: z
        .string()
        .trim()
        .min(1, 'Código requerido'),

    role: z
        .string()
        .trim()
        .refine(
            value => ['admin', 'user'].includes(value),
            {
                message: 'Selecciona un rol válido'
            }
        ),
});

const updateStatusSchema = statusSchema;

module.exports = { userSchema, updateStatusSchema };