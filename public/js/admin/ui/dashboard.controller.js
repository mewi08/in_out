import { authService } from '../../auth/app/auth.service.js';
import { showAlert, autoHideAlert, setLoading, clearAlert } from '../../shared/ui/message.ui.js';
import { loadPartial, renderFooter, setActiveSidebar } from '../../shared/ui/partials.loader.js';
import { applyRolePermissions } from '../../shared/ui/admin.js';
import { updateStats} from '../../users/ui/user.table.js';
import { userService } from '../../users/app/users.service.js';
let stats = [];
// ==== ELEMENTS DOM ====
const user = document.getElementById('user');
const wh = document.getElementById('workingHours');

// ==== INIT ====
document.addEventListener('DOMContentLoaded', async()=>{
    clearAlert('alert');

    await loadPartial('sidebar-container','/partials/sidebar.html');
    setActiveSidebar('dashboard');
    applyRolePermissions();
    renderFooter();
    loadStats();
})

// ==== EVENT LISTENER ====
user.addEventListener('click',()=>{
    window.location.href = '/pages/users/list_users.html';
});

wh.addEventListener('click',()=>{
    window.location.href = '/pages/users/working_hours';
})

// ==== FUNCTIONS ====
async function loadStats() {
    try {
        stats = await userService.getStats();
        updateStats(stats);
    } catch (error) {
        console.error('Error cargando stats', error.message);
    }
}