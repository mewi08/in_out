const ExcelJS = require('exceljs');

async function generateExcel(rows, res, options = {}) {

    const {
        mode = 'batch', // 'user' | 'batch'
        user = null,
        filename = 'reporte.xlsx'
    } = options;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Asistencia');

    const COLORS = {
        accent: 'D63384',
        bg: 'FAF9F7',
        border: 'EDE9E4',
        text: '1A1A1F',
        white: 'FFFFFF'
    };

    let headerRowNumber = 1;

    if (mode === 'user' && user) {

        // TITLE
        const title = sheet.addRow(['REPORTE DE ASISTENCIA']);
        sheet.mergeCells(`A${title.number}:C${title.number}`);
        title.height = 28;
        title.getCell(1).font = {
            bold: true,
            size: 18,
            color: { argb: COLORS.accent },
            name: 'DM Serif Display'
        };
        title.getCell(1).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };
        // USER INFO
        const dniRow = sheet.addRow(['DNI:', user.dni]);
        sheet.mergeCells(`B2:C2`);

        const nameRow = sheet.addRow([
            'Nombre:',
            `${user.name} ${user.last_name}`
        ]);
        sheet.mergeCells(`B3:C3`);

        [dniRow, nameRow].forEach((row) => {
            row.getCell(1).font = {
                bold: true,
                color: { argb: COLORS.accent }
            };
            row.getCell(2).font = {
                color: { argb: COLORS.text }
            };
        });
        const headerRow = sheet.addRow([
            'Fecha',
            'Entrada',
            'Salida'
        ]);
        headerRowNumber = headerRow.number;
    }

    // ===============================
    // BATCH MODE
    // ===============================

    if (mode === 'batch') {
        const title = sheet.addRow(['REPORTE DE ASISTENCIAS']);
        sheet.mergeCells(`A${title.number}:F${title.number}`);
        title.height = 28;
        title.getCell(1).font = {
            bold: true,
            size: 18,
            color: { argb: COLORS.accent },
            name: 'DM Serif Display'
        };
        title.getCell(1).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        const headerRow = sheet.addRow([
            'DNI',
            'Nombre',
            'Apellido',
            'Fecha',
            'Entrada',
            'Salida'
        ]);

        headerRowNumber = headerRow.number;
        sheet.columns = [
            { key: 'dni', width: 15 },
            { key: 'name', width: 25 },
            { key: 'lastname', width: 25 },
            { key: 'date', width: 15 },
            { key: 'entry', width: 12 },
            { key: 'exit', width: 12 },
        ];

    } else {
        sheet.columns = [
            { key: 'date', width: 18 },
            { key: 'entry', width: 15 },
            { key: 'exit', width: 15 }
        ];
    }

    rows.forEach((rowData) => {
        sheet.addRow(rowData);
    });

    const headerRow = sheet.getRow(headerRowNumber);

    headerRow.height = 22;

    headerRow.eachCell((cell) => {

        // TEXTO
        cell.font = {
            bold: true,
            color: { argb: COLORS.white },
            name: 'DM Sans',
            size: 11
        };

        // FONDO ROSADO
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: COLORS.accent }
        };

        // CENTRADO
        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        // BORDES
        cell.border = {
            top: {
                style: 'thin',
                color: { argb: COLORS.border }
            },
            left: {
                style: 'thin',
                color: { argb: COLORS.border }
            },
            bottom: {
                style: 'thin',
                color: { argb: COLORS.border }
            },
            right: {
                style: 'thin',
                color: { argb: COLORS.border }
            }
        };

    });

    sheet.eachRow((row, rowNumber) => {
        row.height = 20;
        row.eachCell((cell) => {
            cell.font = {
                name: 'DM Sans',
                size: 10,
                color: { argb: COLORS.text }
            };
            cell.border = {
                bottom: {
                    style: 'thin',
                    color: { argb: COLORS.border }
                }
            };
        });
    });

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