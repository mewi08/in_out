const ExcelJS = require('exceljs');

async function generateExcel(rows, res, options = {}) {
    const {
        mode = 'batch', // 'user' | 'batch'
        user = null,
        filename = 'reporte.xlsx'
    } = options;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Asistencia');

    if (mode === 'user' && user) {
        const title = sheet.addRow(['REPORTE DE ASISTENCIA']);
        title.font = { bold: true, size: 14 };
        sheet.addRow([]);
        sheet.addRow(['DNI:', user.dni]);
        sheet.addRow(['Nombre:', `${user.name} ${user.last_name}`]);
        sheet.addRow([]);
        const headerRow = sheet.addRow(['Fecha', 'Entrada', 'Salida']);
        headerRow.font = { bold: true };
    }

    if (mode === 'batch') {
        sheet.columns = [
            { header: 'DNI', key: 'dni', width: 15 },
            { header: 'Nombre', key: 'name', width: 25 },
            { header: 'Apellido', key: 'lastname', width: 25 },
            { header: 'Fecha', key: 'date', width: 15 },
            { header: 'Entrada', key: 'entry', width: 10 },
            { header: 'Salida', key: 'exit', width: 10 },
        ];
    } else {
        sheet.columns = [
            { key: 'date', width: 15 },
            { key: 'entry', width: 10 },
            { key: 'exit', width: 10 }
        ];
    }

    rows.forEach(row => sheet.addRow(row));
    sheet.getRow(sheet.rowCount - rows.length).font = { bold: true };
    
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}`
    );

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
}

module.exports = { generateExcel };