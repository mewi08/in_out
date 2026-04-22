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
const step3 = document.getElementById('step-3');
const stepDots = document.querySelectorAll('.step-dot');

const submitBtn = document.getElementById('submitDataBtn');
const backBtn = document.getElementById('backBtn');
const backStep1Btn = document.getElementById('goBackToStep1');
const verifySecurityCodeBtn = document.getElementById('verifySecurityCodeBtn');
const confirmChanges = document.getElementById('confirmChanges');
const securityCode = document.getElementById('securityCode');

const dni = document.getElementById('code');
const name = document.getElementById('name');
const last_name = document.getElementById('lastName');
const categorySelect = document.getElementById('category');
const categoryOther = document.getElementById('categoryOther');
const workAreaSelect = document.getElementById('workArea');
const workAreaOther = document.getElementById('workAreaOther');

const employeeName = document.getElementById('summaryName');
const employeeLastName = document.getElementById('summaryLastName');
const employeeCategory = document.getElementById('summaryCategory');
const employeeWorkArea = document.getElementById('summaryWorkArea');

// ===== VARIABLES =====
let currentEmployee = null;
let isSecurityVerified = false;
const savedDni = sessionStorage.getItem('tempDni');

// ====================
document.addEventListener('DOMContentLoaded', (e)=>{
    e.preventDefault();
    autoHideAlert('alert');
    if(savedDni){
        findEmployee(savedDni);    
    }
})

// ===== EVENT LISTENERS =====
backBtn.addEventListener('click', ()=>{
    window.location.href = '/index.html'
});

confirmChanges.addEventListener('click', ()=>{
    goToStep(2);
    sessionStorage.removeItem('tempDni');
});

verifySecurityCodeBtn.addEventListener('click', ()=>{
    const security_code = securityCode.value.trim();

    if(!security_code){
        showAlert('Ingresa el código de seguridad', 'error', 'alert');
        autoHideAlert('alert');
        return;
    }
    verifySecurityCode(security_code);

    //call function then verify security code
    const formdata = getFormData();
    confirmChangeData(formdata);
});

securityCode.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter') verifySecurityCodeBtn.click();
});

backStep1Btn.addEventListener('click', ()=>{
    goToStep(1);
});

submitBtn.addEventListener('click', ()=>{
    updateData();
});

// ===== FUNCTIONS =====
async function findEmployee(code) {
    clearAlert('alert');
    try {
        const user = await userService.getUserByCode(code);

        currentEmployee = user;
        showEmployeeData(currentEmployee);
    } catch (err) {
        showAlert(err.message, 'error', 'alert');
        autoHideAlert('alert');
    }
}

function showEmployeeData(employee) {
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
        dni: dni.value,
        name: name.value.trim(),
        last_name: last_name.value.trim(),
        category,
        work_area
    };
}

async function updateData() {
    clearAlert('alert');
    if (!isSecurityVerified) return;

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
        isSecurityVerified = false;
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

async function verifySecurityCode(security_code){
    try{
        const { valid } = await userService.verifySecurityCode(security_code);
        if(!valid){
            isSecurityVerified = false;
            showAlert('Código incorrecto', 'error', 'alert');
            return
        }
        isSecurityVerified = true;
        goToStep(3);
    }catch(err){
        isSecurityVerified = false;
        showAlert(err.message, 'error', 'alert');
    }
}

function confirmChangeData(formdata){
    employeeName.textContent = formdata.name;
    employeeLastName.textContent = formdata.last_name;
    employeeCategory.textContent = formdata.category;
    employeeWorkArea.textContent = formdata.work_area;
}

function resetAndGoHome(){
    securityCode.value = '';
    currentEmployee = null;
    isSecurityVerified = false;
    
    window.location.href = '/index.html'
}

function goToStep(stepNumber){
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    document.getElementById(`step-${stepNumber}`).classList.add('active');
    stepDots.forEach((dot, index)=>{
        dot.classList.toggle('active', index < stepNumber);
    });

    clearAlert('alert');
}