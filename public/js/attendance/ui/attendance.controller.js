import { userService } from '../../users/app/users.service.js';
import { attendanceService } from '../app/attendance.service.js';
import {
    showAlert,
    clearAlert,
    autoHideAlert,
    setLoading
} from '../../shared/message.ui.js';
import { startClock } from '../../shared/clock.js';

// ===== ELEMENTOS DOM =====
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const stepDots = document.querySelectorAll('.step-dot');

const codeInput = document.getElementById('codeInput');
const validateCodeBtn = document.getElementById('validateCodeBtn');
const backBtn = document.getElementById('backBtn');

const employeeName = document.getElementById('employeeName');
const employeeCategory = document.getElementById('employeeCategory');
const employeeCode = document.getElementById('employeeCode');
const employeeWorkArea = document.getElementById('employeeWorkArea');
const avatarInitials = document.getElementById('avatarInitials');
const confirmDataBtn = document.getElementById('confirmDataBtn');
const changeCodeBtn = document.getElementById('changeCodeBtn');

const checkInBtn = document.getElementById('checkInBtn');
const checkOutBtn = document.getElementById('checkOutBtn');
const backStep2Btn = document.getElementById('backStep2Btn');
const currentTime = document.getElementById('currentTime');

// ===== VARIABLES =====
let currentEmployee = null;
let currentDni = null;
//let hasCheckedInToday = null;
//let hasCheckedOutToday = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    
    const savedDni = sessionStorage.getItem('tempDni');
    if (savedDni) {
        codeInput.value = savedDni;
        validateCode(savedDni);
    }
    
    startClock('currentTime');
});

// ===== EVENT LISTENERS =====
validateCodeBtn.addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (!code) {
        showAlert('Ingresa tu DNI', 'error', 'alert');
        autoHideAlert('alert');
        return;
    }
    validateCode(code);
});

codeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validateCodeBtn.click();
});

backBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
});

confirmDataBtn.addEventListener('click', () => {
    goToStep(3);
});

changeCodeBtn.addEventListener('click', () => {
    goToStep(1);
    codeInput.value = '';
    codeInput.focus();
    sessionStorage.removeItem('tempDni');
    currentEmployee = null;
    currentDni = null;
});

backStep2Btn.addEventListener('click', () => {
    goToStep(2);
});

checkInBtn.addEventListener('click', () => markAttendance('check_in'));
checkOutBtn.addEventListener('click', () => markAttendance('check_out'));

// ===== FUNCIONES =====

async function validateCode(code) {
    clearAlert('alert');
    setLoading(validateCodeBtn, true);

    try {
        const user = await userService.getUserByCode(code);
        
        currentEmployee = user;
        currentDni = code;
        sessionStorage.setItem('tempDni', code);
        showEmployeeData(currentEmployee);
        goToStep(2);

    } catch (err) {
        showAlert(err.message , 'error', 'alert');
        autoHideAlert('alert');
    } finally {
        setLoading(validateCodeBtn, false);
    }
}
/*
async function checkTodayStatus(user_id){
    try{
        const result = await attendanceService.getTodayHours(user_id);
        
    }catch(err){

    }
}*/

function showEmployeeData(employee) {
    employeeName.textContent = `${employee.name} ${employee.last_name}`;
    employeeCategory.textContent = employee.category;
    employeeCode.textContent = employee.entered_code || employee.code;
    
    // ✅ CAMBIADO: Mostrar work_area en lugar de category repetido
    employeeWorkArea.textContent = employee.work_area || 'No especificado';
    
    const initials = `${employee.name[0]}${employee.last_name[0]}`.toUpperCase();
    avatarInitials.textContent = initials;
}

async function markAttendance(type) {
    if (!currentEmployee || !currentDni) {
        showAlert('Usuario no válido', 'error', 'alert');
        return;
    };
    
    const btn = type === 'check_in' ? checkInBtn : checkOutBtn;
    setLoading(btn, true);

    try {
        await attendanceService.createRecord({
            entered_code: currentDni,
            type: type
        });

        const msg = type === 'check_in'
            ? '¡Entrada registrada!'
            : 'Salida registrada!';
        showAlert(msg, 'success', 'alert');

        btn.disabled = true;
        btn.style.opacity = '0.5';

        setTimeout(() => {
            resetAndGoHome();
        }, 2000);

    } catch (err) {
        if (err.message && err.message.includes('check-in sin check-out')) {
            showAlert('Ya marcaste entrada. Debes marcar salida primero.', 'error', 'alert');
        } else if (err.message && err.message.includes('check-out sin check-in')) {
            showAlert('No has marcado entrada. Debes marcar entrada primero.', 'error', 'alert');
        } else {
            showAlert(err.message || 'Error al registrar asistencia', 'error', 'alert');
        }
        autoHideAlert('alert');
    } finally {
        setLoading(btn, false);
    }
}

function resetAndGoHome() {
    sessionStorage.removeItem('tempDni');
    currentEmployee = null;
    currentDni = null;
    codeInput.value = '';
    
    checkInBtn.disabled = false;
    checkOutBtn.disabled = false;
    checkInBtn.style.opacity = '1';
    checkOutBtn.style.opacity = '1';
    
    goToStep(1);
}

function goToStep(stepNumber) {
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    stepDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < stepNumber);
    });
    
    clearAlert('alert');
}