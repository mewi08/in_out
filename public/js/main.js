document.getElementById('registerBtn').addEventListener('click', ()=>{
    window.location.href ='/pages/users/register_profile.html';
});

document.getElementById('attendanceBtn').addEventListener('click', ()=>{
    window.location.href = '/pages/attendance/register_attendance.html'
})

/*
document.getElementById('btnUpdate').addEventListener('click', ()=>{
    showAlert('Redirigiendo a actualización...', 'success');
    autoHideAlert();

    setTimeout(() => {
        window.location.href('pages/update_profile.html');
    }, 1500);
});*/