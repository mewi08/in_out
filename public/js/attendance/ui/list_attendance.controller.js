import { attendanceService } from '../app/attendance.service.js';
import { clearAlert } from '../../shared/ui/message.ui.js';
import { loadPartial, renderFooter, setActiveSidebar } from '../../shared/ui/partials.loader.js';
import { applyRolePermissions, requireAuth } from '../../shared/ui/admin.js';
import { formatDate } from '../../shared/utils/date.helper.js';

let currentPage = 1;

document.addEventListener('DOMContentLoaded', async ()=>{
    if (!requireAuth()) return;
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    setActiveSidebar('asistencias');
    await loadAttendance(currentPage);
    initPagination();
});

function initPagination() {
    document.getElementById('nextBtn').addEventListener('click', async () => {
        currentPage++;
        await loadAttendance(currentPage);
    });

    document.getElementById('prevBtn').addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await loadAttendance(currentPage);
        }
    });
}

async function loadAttendance(page=1){
    try {
        const attendance = await attendanceService.getAttendanceReport(page);
        renderTable(attendance);
    } catch (error) {
        console.error('Error cargando asistencias:', error);
    }
}

function renderTable(attendance){
    const tbody = document.getElementById("attendanceTableBody");
    if(!attendance.length) {
        tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                No hay registros
            </td>
        </tr>`;
        return;
    }
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
