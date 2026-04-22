import { startClock } from './shared/clock.js';

startClock('time', 'date');

document.getElementById('registerBtn').addEventListener('click', ()=>{
    window.location.href ='/pages/users/register_profile.html';
});

document.getElementById('visitBtn').addEventListener('click', ()=>{
    window.location.href = '/pages/users/visit.html';
});

document.getElementById('checkOutBtn').addEventListener('click', ()=>{
    const form = 'checkOutBtn';
    sessionStorage.setItem('type', form);
    window.location.href = '/pages/attendance/register_attendance.html'
});

document.getElementById('checkInBtn').addEventListener('click', ()=>{
    const form = 'checkInBtn';
    sessionStorage.setItem('type', form);
    window.location.href = '/pages/attendance/register_attendance.html';
});