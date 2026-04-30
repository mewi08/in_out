import { loadPartial } from './shared/ui/partials.loader.js';
import { startClock } from './shared/utils/clock.js';
import { authService } from './auth/app/auth.service.js';
document.addEventListener('DOMContentLoaded', async () => {
    await loadPartial('sidebar-container', '/partials/sidebar.html');

    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
        document.querySelectorAll('[data-admin]').forEach(el => el.remove());
    }
    
    document.querySelector('[data-page="index"]')?.classList.add('active');

    startClock('time', 'date');

    document.getElementById('checkInBtn').addEventListener('click', ()=>{
        window.location.href = '/pages/attendance/register_attendance.html?type=check_in';
    });

    document.getElementById('checkOutBtn').addEventListener('click', ()=>{
        window.location.href = '/pages/attendance/register_attendance.html?type=check_out'
    });
})