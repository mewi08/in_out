import { showAlert, autoHideAlert, setLoading, clearAlert } from '../../shared/ui/message.ui.js';
import { loadPartial, renderFooter, setActiveSidebar } from '../../shared/ui/partials.loader.js';
import { applyRolePermissions, requireAuth } from '../../shared/ui/admin.js';
import { updateStats} from '../../users/ui/user.table.js';
import { userService } from '../../users/app/users.service.js';
import { loadActivities } from '../../activity_log/ui/activity_log.render.js';
let stats = [];

document.addEventListener('DOMContentLoaded', async()=>{
    clearAlert('alert');
    if (!requireAuth()) return;
    await loadPartial('sidebar-container','/partials/sidebar.html');
    setActiveSidebar('dashboard');
    applyRolePermissions();
    renderFooter();
    loadStats();
    await loadActivities();

    // ==== EVENT LISTENER ====
    document.getElementById('btnUser').addEventListener('click',()=>{
        window.location.href = '/pages/users/users.html';
    });

    document.getElementById('btnAttendance').addEventListener('click',()=>{
        window.location.href = '/pages/attendance/list_attendance.html';
    });

    document.getElementById('btnAreas').addEventListener('click', ()=>{
        window.location.href = '/pages/work_area/list_workArea.html';
    });

});

// ==== FUNCTIONS ====
async function loadStats() {
    try {
        stats = await userService.getStats();
        updateStats(stats);
    } catch (error) {
        console.error('Error cargando stats', error.message);
    }
}