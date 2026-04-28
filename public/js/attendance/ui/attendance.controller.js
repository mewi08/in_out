import { userService } from '../../users/app/users.service.js';
import { attendanceService } from '../app/attendance.service.js';
import {
    showAlert,
    clearAlert,
    autoHideAlert,
    setLoading
} from '../../shared/message.ui.js';

// ===== ELEMENTOS DOM =====
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const stepDots = document.querySelectorAll('.step-dot');

const codeInput = document.getElementById('codeInput');
const validateCodeBtn = document.getElementById('validateCodeBtn');
const backBtn = document.getElementById('backBtn');
const employeeName = document.getElementById('employeeName');
const employeeCategory = document.getElementById('employeeCategory');
const employeeDni = document.getElementById('employeeDni');
const employeeWorkArea = document.getElementById('employeeWorkArea');
const avatarInitials = document.getElementById('avatarInitials');
const confirmBtn = document.getElementById('confirmBtn');
const changeCodeBtn = document.getElementById('changeCodeBtn');

const subtitle = document.getElementById('subtitle');

// ===== VARIABLES =====
let currentEmployee = null;
let code = null;
let currentType = null;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded',()=>{
    clearAlert('alert');
    const type = getTypeFromURL();

    if (type === 'check_in') {
        subtitle.textContent = 'Registra entrada';
        currentType = 'check_in';
    } else if (type === 'check_out') {
        subtitle.textContent = 'Registra salida';
        currentType = 'check_out';
    } else {
        subtitle.textContent = 'Registrar asistencia';
        currentType = 'check_in';
    }
});

// ===== EVENT LISTENERS =====
validateCodeBtn.addEventListener('click', ()=>{
    const codeClean = codeInput.value.trim();
    if (!codeClean) {
        showAlert('Ingresa tu código', 'error', 'alert');
        autoHideAlert('alert');
        return;
    }
    validateCode(codeClean);
});

codeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validateCodeBtn.click();
});

backBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
});

confirmBtn.addEventListener('click', async () => {
    markAttendance(currentType);
});

changeCodeBtn.addEventListener('click', () => {
    goToStep(1);
    codeInput.value = '';
    codeInput.focus();
    currentEmployee = null;
    code = null;
});

// ===== FUNCIONES =====
async function validateCode(codeClean) {
    clearAlert('alert');
    setLoading(validateCodeBtn, true);

    try {
        const user = await userService.getUserByCode(codeClean);
        currentEmployee = user;
        code = codeClean;

        showEmployeeData(currentEmployee);
        goToStep(2);

    } catch (err) {
        showAlert(err.message , 'error', 'alert');
        autoHideAlert('alert');
    } finally {
        setLoading(validateCodeBtn, false);
    }
}

function showEmployeeData(employee) {
    employeeName.textContent = `${employee.name} ${employee.last_name}`;
    employeeCategory.textContent = employee.category;
    employeeDni.textContent = employee.dni;
    employeeWorkArea.textContent = employee.work_area || 'No especificado';
    
    const initials = `${employee.name[0]}${employee.last_name[0]}`.toUpperCase();
    avatarInitials.textContent = initials;
}

function getTypeFromURL(){
    const params = new URLSearchParams(window.location.search);
    return params.get('type');
}

async function markAttendance(type) {
    if (!currentEmployee || !code) {
        showAlert('Usuario no válido', 'error', 'alert');
        return;
    };
    
    setLoading(confirmBtn, true);

    try {
        const attendance = await attendanceService.createRecord({
            code: code,
            type: type
        });

        showAlert(attendance.message, 'success', 'alert');

        setTimeout(() => {
            resetAndGoHome();
        }, 2000);

    } catch (err) {
        const isNetwork = err instanceof TypeError;
        showAlert(
            isNetwork
                ? 'No se pudo conectar con el servidor'
                : err.message,
            'error',
            'alert'
        );
        autoHideAlert('alert');
    } finally {
        setLoading(confirmBtn, false);
    }
}

function resetAndGoHome() {
    currentEmployee = null;
    code = null;
    codeInput.value = '';  
    window.location.href = '/index.html';
}

function goToStep(stepNumber) {
    step1.classList.remove('active');
    step2.classList.remove('active');
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    stepDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < stepNumber);
    });
    clearAlert('alert');
}