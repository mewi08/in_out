import { startClock } from './shared/clock.js';

startClock('time', 'date');

document.getElementById('registerBtn').addEventListener('click', ()=>{
    window.location.href ='/pages/users/register_profile.html';
});

document.getElementById('attendanceBtn').addEventListener('click', ()=>{
    window.location.href = '/pages/attendance/register_attendance.html'
})
