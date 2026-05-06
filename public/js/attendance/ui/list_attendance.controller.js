import { attendanceService } from '../app/attendance.service.js';
import { clearAlert } from '../../shared/ui/message.ui.js';
import {loadPartial, renderFooter} from '../../shared/ui/partials.loader.js';
import { applyRolePermissions } from '../../shared/ui/admin.js';
import { formatDate } from '../../shared/utils/date.helper.js';
document.addEventListener('DOMContentLoaded', init);

async function init() {
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    await loadAttendance();
}

async function loadAttendance(){
    try {
        const attendance = await attendanceService.getAttendanceReport();
        renderTable(attendance);
    } catch (error) {
        console.error('Error cargando asistencias:', error);
    }
}

function renderTable(attendance){
    const tbody = document.getElementById("attendanceTableBody");
    tbody.innerHTML = attendance.map(a=>`
        <tr>
            <td>${a.dni}</td>
            <td>${a.name}</td>
            <td>${a.last_name}</td>
            <td>${formatDate(a.date)}</td>
            <td>${a.entrada? a.entrada : '-'}</td>
            <td>${a.salida? a.salida : '-'}</td>
        </tr>    
    `).join("");
}
