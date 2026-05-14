const { z } = require('zod');
const { statusSchema } = require('../../../shared/utils/validator/status.schema');
const workAreaSchema = z.object({
    name: z
        .string({
            required_error: 'El nombre es obligatorio'
        })
        .trim()
        .min(3)
        .max(100),
});

const updateStatus = statusSchema;

module.exports = { workAreaSchema, updateStatus }