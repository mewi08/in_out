const { z } = require('zod');

const attendanceSchema = z.object({
    code: z
        .string({
            required_error: 'Código requerido'
        })
        .trim()
        .min(1, 'Código requerido'),

    type: z
        .string({
            required_error: 'Tipo de asistencia requerido'
        })
        .trim()
        .min(1, 'Tipo de asistencia requerido')
});

module.exports = { attendanceSchema } ;