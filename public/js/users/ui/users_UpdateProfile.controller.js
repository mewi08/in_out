import { userService } from "../app/users.service.js";
import { setupToggleExtraField } from "./toggleExtraField.ui.js";

import { 
    showAlert, 
    clearAlert, 
    autoHideAlert, 
    setLoading 
} from "../../shared/message.ui.js";

setupToggleExtraField("category", "categoryExtra", "otro");
setupToggleExtraField("workArea", "workAreaExtra", "otro");

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
const last_name = document.getElementById('lastName');
const categorySelect = document.getElementById('category');
const categoryOther = document.getElementById('categoryOther');
const workAreaSelect = document.getElementById('workArea');
const workAreaOther = document.getElementById('workAreaOther');

const employeeName = document.getElementById('summaryName');
const employeeLastName = document.getElementById('summaryLastName');
const employeeDni = document.getElementById('summaryDni');
const employeeCategory = document.getElementById('summaryCategory');
const employeeWorkArea = document.getElementById('summaryWorkArea');

// ===== VARIABLES =====
let currentEmployee = null;

// ===== EVENT LISTENERS =====
backBtn.addEventListener('click', ()=> {
    window.location.href = '/index.html';
});

continueBtn.addEventListener('click', ()=> {
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
    dni.value = employee.dni || '';
    name.value = employee.name || '';
    last_name.value = employee.last_name || '';
    const categoryOptions = Array.from(categorySelect.options).map(opt => opt.value);
    if (categoryOptions.includes(employee.category)) {
        categorySelect.value = employee.category;
    } else {
        categorySelect.value = 'otro';
        categoryOther.value = employee.category || '';
    }
    const workAreaOptions = Array.from(workAreaSelect.options).map(opt => opt.value);
    if (workAreaOptions.includes(employee.work_area)) {
        workAreaSelect.value = employee.work_area;
    } else {
        workAreaSelect.value = 'otro';
        workAreaOther.value = employee.work_area || '';
    }
    categorySelect.dispatchEvent(new Event('change'));
    workAreaSelect.dispatchEvent(new Event('change'));
}

function getFormData() {
    const category = categorySelect.value === 'otro'
        ? categoryOther.value.trim()
        : categorySelect.value;
    const work_area = workAreaSelect.value === 'otro'
        ? workAreaOther.value.trim()
        : workAreaSelect.value;
    return {
        name: name.value.trim(),
        last_name: last_name.value.trim(),
        dni: dni.value.trim(),
        category,
        work_area
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
    employeeCategory.textContent = formdata.category;
    employeeWorkArea.textContent = formdata.work_area;
}

function resetAndGoHome(){
    currentEmployee = null;
    window.location.href = '/index.html'
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