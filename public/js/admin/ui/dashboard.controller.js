import { showAlert, autoHideAlert, setLoading, clearAlert } from '../../shared/ui/message.ui.js';
import { loadPartial, renderFooter, setActiveSidebar } from '../../shared/ui/partials.loader.js';
import { applyRolePermissions, requireAuth } from '../../shared/ui/admin.js';
import { updateStats} from '../../users/ui/user.table.js';
import { userService } from '../../users/app/users.service.js';
import { loadActivities } from '../../activity_log/ui/activity_log.render.js';
let stats = [];

// ==== INIT ====
document.addEventListener('DOMContentLoaded', async()=>{
    clearAlert('alert');

    await loadPartial('sidebar-container','/partials/sidebar.html');
    setActiveSidebar('dashboard');
    requireAuth();
    applyRolePermissions();
    renderFooter();
    loadStats();
    await loadActivities();

    // ==== EVENT LISTENER ====
    document.getElementById('user').addEventListener('click',()=>{
        window.location.href = '/pages/users/list_users.html';
    });

    document.getElementById('attendance').addEventListener('click',()=>{
        window.location.href = '/pages/attendance/list_attendance.html';
    });

    document.getElementById('areas').addEventListener('click', ()=>{
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