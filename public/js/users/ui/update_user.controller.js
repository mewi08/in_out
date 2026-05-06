import { userService } from "../app/users.service.js";

import { 
    showAlert, 
    clearAlert, 
    autoHideAlert, 
    setLoading 
} from "../../shared/ui/message.ui.js";

// ===== DOM =====
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const stepDots = document.querySelectorAll('.step-dot');

const submitBtn = document.getElementById('submitBtn');
const backBtn = document.getElementById('backBtn');
const backStep1Btn = document.getElementById('goBackToStep1');
const continueBtn = document.getElementById('continueBtn');

const dni = document.getElementById('dni');
const name = document.getElementById('name');
const code = document.getElementById('code');
const last_name = document.getElementById('lastName');
const categorySelect = document.getElementById('category');
const workAreaSelect = document.getElementById('workArea');

const employeeName = document.getElementById('summaryName');
const employeeLastName = document.getElementById('summaryLastName');
const employeeDni = document.getElementById('summaryDni');
const employeeCode = document.getElementById('summaryCode');
const employeeCategory = document.getElementById('summaryCategory');
const employeeWorkArea = document.getElementById('summaryWorkArea');

// ===== VARIABLES =====
let currentEmployee = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        showAlert('Usuario no encontrado', 'error', 'alert');
        return;
    }

    await findEmployee(id);
};

// ===== EVENT LISTENERS =====
backBtn.addEventListener('click', ()=> {
    window.location.href = '/pages/users/list_users.html';
});

continueBtn.addEventListener('click', ()=> {
    const formdata = getFormData();
    confirmChangeData(formdata);
    goToStep(2);
});

backStep1Btn.addEventListener('click', ()=> {
    goToStep(1);
});

submitBtn.addEventListener('click', ()=> {
    updateData();
});

// ===== FUNCTIONS =====
async function findEmployee(id) {
    clearAlert('alert');
    try {
        const user = await userService.getUserById(id);
        currentEmployee = user;
        setEmployeeData(currentEmployee);
    } catch (err) {
        showAlert(err.message, 'error', 'alert');
        autoHideAlert('alert');
    }
}

function setEmployeeData(employee) {
    code.value = employee.code || '';
    dni.value = employee.dni || '';
    name.value = employee.name || '';
    last_name.value = employee.last_name || '';
    const categoryOptions = Array.from(categorySelect.options).map(opt => opt.value);
    if (categoryOptions.includes(employee.category)) {
        categorySelect.value = employee.category;
    } 
    const workAreaOptions = Array.from(workAreaSelect.options).map(opt => opt.value);
    if (workAreaOptions.includes(employee.work_area)) {
        workAreaSelect.value = employee.work_area;
    }
}

function getFormData() {
    return {
        name: name.value.trim(),
        last_name: last_name.value.trim(),
        dni: dni.value.trim(),
        code: code.value.trim(),
        category: categorySelect.value,
        work_area: workAreaSelect.value
    };
}

async function updateData() {
    clearAlert('alert');
    setLoading(submitBtn, true);
    const formdata = getFormData();
    try{
        await userService.updateUser(currentEmployee.id, formdata);
        showAlert('Datos actualizados correctamente', 'success', 'alert');
        setTimeout(() => {
            resetAndGoHome();
        }, 1000);
    }catch(err){
        const isNetwork = err instanceof TypeError;
        showAlert(
            isNetwork
                ? 'No se pudo conectar con el servidor'
                : err.message, 
            'error', 
            'alert'
        );
        autoHideAlert('alert');
    }finally{
        setLoading(submitBtn, false);
    }
}

function confirmChangeData(formdata){
    employeeName.textContent = formdata.name;
    employeeLastName.textContent = formdata.last_name;
    employeeDni.textContent = formdata.dni;
    employeeCode.textContent = formdata.code;
    employeeCategory.textContent = formdata.category;
    employeeWorkArea.textContent = formdata.work_area;
}

function resetAndGoHome(){
    currentEmployee = null;
    window.location.href = '/pages/admin/dashboard.html'
}

function goToStep(stepNumber){
    step1.classList.remove('active');
    step2.classList.remove('active');

    document.getElementById(`step-${stepNumber}`).classList.add('active');
    stepDots.forEach((dot, index)=>{
        dot.classList.toggle('active', index < stepNumber);
    });

    clearAlert('alert');
}