const ExcelJS = require('exceljs');

async function generateExcel(rows, res, filename = 'reporte.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Asistencia');

    sheet.columns = [
        { header: 'DNI', key: 'dni', width: 15 },
        { header: 'Nombre', key: 'name', width: 25 },
        { header: 'Fecha', key: 'date', width: 15 },
        { header: 'Entrada', key: 'entry', width: 10 },
        { header: 'Salida', key: 'exit', width: 10 }
    ];

    rows.forEach(row => sheet.addRow(row));

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