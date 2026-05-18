import { loadPartial, renderFooter, setActiveSidebar } from './shared/ui/partials.loader.js';
import { startClock } from './shared/utils/clock.js';
import { authService } from './auth/app/auth.service.js';
import { applyRolePermissions } from './shared/ui/admin.js';
document.addEventListener('DOMContentLoaded', async () => {
    const user = authService.getCurrentUser();
    if (user?.role === 'admin') {
        window.location.replace('pages/admin/dashboard.html');
    }
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    setActiveSidebar('index');
    startClock('time', 'date');

    document.getElementById('checkInBtn').addEventListener('click', ()=>{
        window.location.href = '/pages/attendance/register_attendance.html?type=check_in';
    });

    document.getElementById('checkOutBtn').addEventListener('click', ()=>{
        window.location.href = '/pages/attendance/register_attendance.html?type=check_out'
    });
})