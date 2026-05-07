import { attendanceService } from "../app/attendance.service.js";
import { formatDate } from '../../shared/utils/date.helper.js';
import { downloadFile } from "../../shared/utils/download.js";

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await bindExportAll();
    await bindExportByUser();
}

async function bindExportAll() {
    const btn = document.getElementById('exportAttendanceAll');
    btn.addEventListener('click', async () => {
        try {
            const start = document.getElementById('fechaInicioAll').value;
            const end = document.getElementById('fechaFinAll').value;

            if(!start || !end) {
                console.log('Please select both start and end dates.');
                return;
            }
            const blob =  await attendanceService.exportAllUrl({startDate: start, endDate: end});
            console.log(blob);
            console.log(await blob.text());
            downloadFile(blob, `attendance_report_${start}_to_${end}.xlsx`);
        } catch (error) {
            console.error('Error exporting attendance:', error);
        }
    });
}

async function bindExportByUser() {
    const btn = document.getElementById('exportAttendanceByUser');
    btn.addEventListener('click', async () => {
        try {
            const userDni = document.getElementById('dniInput').value.trim();
            const start = document.getElementById('fechaInicioUser').value;
            const end = document.getElementById('fechaFinUser').value;
            if(!userDni || !start || !end) {
                console.log('Please enter DNI and select both start and end dates.');
                return;
            }
            const blob = await attendanceService.exportByUserUrl({ dni: userDni, startDate: start, endDate: end });
            downloadFile(blob, `attendance_report_${userDni}_${start}_to_${end}.xlsx`);
        } catch (error) {
            console.error('Error exporting attendance by user:', error);
        }    
    });
}