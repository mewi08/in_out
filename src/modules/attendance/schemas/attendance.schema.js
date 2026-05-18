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

const dateString = z
    .string({
        required_error: 'La fecha es obligatoria'
    })
    .min(1, 'La fecha no puede estar vacía')
    .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Formato de fecha inválido'
    });

const exportAllSchema = z.object({
    startDate: dateString,
    endDate: dateString
}).refine((data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
}, {
    message: 'La fecha inicio no puede ser mayor a la fecha fin',
    path: ['startDate']
});


const exportUserSchema = z.object({
    startDate: dateString,
    endDate: dateString
}).refine((data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
}, {
    message: 'La fecha inicio no puede ser mayor a la fecha fin',
    path: ['startDate']
});

module.exports = { attendanceSchema, exportAllSchema, exportUserSchema } ;