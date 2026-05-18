import { attendanceService } from "../app/attendance.service.js";
import { formatDate } from '../../shared/utils/date.helper.js';
import { downloadFile } from "../../shared/utils/download.js";
import { showAlert, autoHideAlert } from "../../shared/ui/message.ui.js";

document.addEventListener('DOMContentLoaded', async ()=>{
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
            downloadFile(blob, `attendance_report_${start}_${end}.xlsx`);
        } catch (err) {
            const type =
                err.status >= 500
                    ? 'danger'
                    : 'warning';
            showAlert(err.message, type, 'alert');
            autoHideAlert('alert');
        }
    });
});