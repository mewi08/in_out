import { loadPartial } from './shared/partials.loader.js';
import { startClock } from './shared/clock.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    startClock('time', 'date');

    document.getElementById('checkInBtn').addEventListener('click', ()=>{
        window.location.href = '/pages/attendance/register_attendance.html?type=check_in';
    });

    document.getElementById('checkOutBtn').addEventListener('click', ()=>{
        window.location.href = '/pages/attendance/register_attendance.html?type=check_out'
    });
})