// scripts/admin.js
const dotenv = require('dotenv');
const pool = require('../src/shared/infrastructure/database');

dotenv.config();

async function createAdmin() {
    console.log('\n=== CREACIÓN DE ADMINISTRADOR ===\n');

    try {
        // Datos desde .env
        const adminData = {
            name: process.env.ADMIN_NAME,
            last_name: process.env.ADMIN_LAST_NAME,
            dni: process.env.ADMIN_DNI,
            category: process.env.ADMIN_CATEGORY,
            work_area_id: process.env.ADMIN_WORK_AREA,
            code: process.env.ADMIN_CODE,
            role: process.env.ADMIN_ROLE
        };

        // Verificar si ya existe por DNI
        const [existingUser] = await pool.query(
            `SELECT id FROM users WHERE dni = ?`,
            [adminData.dni]
        );

        if (existingUser.length > 0) {
            console.log('El administrador ya existe');
            process.exit(0);
        }

         //Insertar admin
        const [result] = await pool.query(
            `INSERT INTO users (
                name,
                last_name,
                dni,
                category,
                work_area_id,
                code,
                role
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                adminData.name,
                adminData.last_name,
                adminData.dni,
                adminData.category,
                adminData.work_area_id,
                adminData.code,
                adminData.role
            ]
        );

        console.log('\nADMINISTRADOR CREADO EXITOSAMENTE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('ID:', result.insertId);
        console.log('Nombre:', adminData.name);
        console.log('DNI:', adminData.dni);
        console.log('Código:', adminData.code);
        console.log('Rol:', adminData.role);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\nListo para usar\n');

        process.exit(0);

    } catch (error) {
        console.error('\nERROR AL CREAR ADMIN');
        console.error(error.message);
        process.exit(1);
    }
}

createAdmin();