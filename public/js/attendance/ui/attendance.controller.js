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
let currentId = null;

document.addEventListener('DOMContentLoaded',()=>{
    setType();
    clearAlert('alert');
})

// ===== EVENT LISTENERS =====
validateCodeBtn.addEventListener('click', ()=>{
    const code = codeInput.value.trim();
    if (!code) {
        showAlert('Ingresa tu Código', 'error', 'alert');
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

confirmBtn.addEventListener('click', async () => {
    setType();
});

changeCodeBtn.addEventListener('click', () => {
    goToStep(1);
    codeInput.value = '';
    codeInput.focus();
    sessionStorage.removeItem('tempCode');
    currentEmployee = null;
    currentId = null;
});

// ===== FUNCIONES =====
async function validateCode(code) {
    clearAlert('alert');
    setLoading(validateCodeBtn, true);

    try {
        const user = await userService.getUserById(code);
        currentEmployee = user;
        currentId = code;

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

function setType(){
    const type = sessionStorage.getItem('type');
    if(type == 'checkInBtn'){
        subtitle.textContent = 'Registra entrada';
        markAttendance('check_in');
    }else{
        subtitle.textContent = 'Registra salida';
        markAttendance('check_out');
    }
}

async function markAttendance(type) {
    if (!currentEmployee || !currentId) {
        showAlert('Usuario no válido', 'error', 'alert');
        return;
    };
    
    setLoading(confirmBtn, true);

    try {
        await attendanceService.createRecord({
            code: currentId,
            type: type
        });

        const msg = type === 'check_in'
            ? '¡Entrada registrada!'
            : '¡Salida registrada!';
        showAlert(msg, 'success', 'alert');

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
    sessionStorage.removeItem('tempCode');
    sessionStorage.removeItem('type');
    currentEmployee = null;
    currentId = null;
    codeInput.value = '';
    
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    
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