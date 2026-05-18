import { userService } from '../../users/app/users.service.js';
import { attendanceService } from '../app/attendance.service.js';
import {
    showAlert,
    clearAlert,
    autoHideAlert,
    setLoading
} from '../../shared/ui/message.ui.js';

let currentEmployee = null;
let currentCode = null;
let currentType = 'check_in';

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const stepDots = document.querySelectorAll('.step-dot');

const subtitle = document.getElementById('subtitle');
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

document.addEventListener('DOMContentLoaded', async () => {
    clearAlert('alert');
    setupAttendanceType();
    setupEvents();
});

function setupEvents() {
    validateCodeBtn.addEventListener('click', handleValidateCode);
    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { handleValidateCode() };
    });
    confirmBtn.addEventListener('click', handleMarkAttendance);
    changeCodeBtn.addEventListener('click', handleChangeCode);
    backBtn.addEventListener('click', () => {
        window.location.href = '/index.html';
    });
}

function setupAttendanceType() {
    const type = getTypeFromURL();
    if (type === 'check_out') {
        subtitle.textContent = 'Registra salida';
        currentType = 'check_out';
        return;
    }
    subtitle.textContent = 'Registra entrada';
    currentType = 'check_in';
}

async function handleValidateCode() {
    const code = codeInput.value.trim();
    if (!code) {
        showAlert('Ingresa tu código', 'warning', 'alert');
        autoHideAlert('alert');
        return;
    }
    await validateCode(code);
}

async function handleMarkAttendance() {
    if (!currentEmployee || !currentCode) {
        showAlert('Usuario no válido', 'danger', 'alert');
        return;
    }

    try {
        setLoading(confirmBtn, true);
        const attendance = await attendanceService.createRecord({
            code: currentCode,
            type: currentType
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
            'danger',
            'alert'
        );
        autoHideAlert('alert');
    } finally {
        setLoading(confirmBtn, false);
    }
}

function handleChangeCode() {
    currentEmployee = null;
    currentCode = null;
    codeInput.value = '';
    codeInput.focus();
    goToStep(1);
}

async function validateCode(code) {
    try {
        clearAlert('alert');
        setLoading(validateCodeBtn, true);
        const user = await userService.getUserByCode(code);
        currentEmployee = user;
        currentCode = code;
        renderEmployee(user);
        goToStep(2);
    } catch (err) {
        showAlert(err.message, 'danger', 'alert');
        autoHideAlert('alert');
    } finally {
        setLoading(validateCodeBtn, false);
    }
}

function renderEmployee(employee) {
    employeeName.textContent = `${employee.name} ${employee.last_name}`;
    employeeCategory.textContent = employee.category;
    employeeDni.textContent = employee.dni;
    employeeWorkArea.textContent = employee.work_area || 'No especificado';
    avatarInitials.textContent = `${employee.name[0]}${employee.last_name[0]}`.toUpperCase();
}

function goToStep(stepNumber) {
    step1.classList.add('d-none');
    step2.classList.add('d-none');
    document.getElementById(`step-${stepNumber}`).classList.remove('d-none');

    stepDots.forEach((dot, index) => {
        dot.classList.remove(
            'bg-primary',
            'bg-secondary'
        );

        dot.classList.add(
            index < stepNumber
                ? 'bg-primary'
                : 'bg-secondary'
        );
    });
    clearAlert('alert');
}

function getTypeFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('type');
}

function resetAndGoHome() {
    currentEmployee = null;
    currentCode = null;
    codeInput.value = '';
    window.location.href = '/index.html';
}