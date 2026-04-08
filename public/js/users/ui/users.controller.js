import { userService } from "../app/users.service.js";
import {
    showAlert,
    clearAlert,
    setLoading,
    autoHideAlert
} from "../../shared/message.ui.js";

import { setupToggleExtraField } from './toggleExtraField.ui.js';

// Mostrar/ocultar campos "otro"
setupToggleExtraField("category", "categoryExtra", "otro");
setupToggleExtraField("workArea", "workAreaExtra", "otro");

document.getElementById('registerForm').addEventListener('submit', handleSubmit);

const backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
});

async function handleSubmit(e) {
    e.preventDefault();
    console.log('1. Formulario enviado');

    clearAlert();
    setLoading(true);
    console.log('2. Loading activado');

    // ===== LECTURA DE DATOS =====
    const name = document.getElementById('name').value.trim();
    const last_name = document.getElementById('lastName').value.trim();
    const entered_code  = document.getElementById('code').value.trim();

    const categorySelect = document.getElementById('category').value;
    const categoryOther = document.getElementById('categoryOther').value.trim();

    const workAreaSelect = document.getElementById('workArea').value;
    const workAreaOther = document.getElementById('workAreaOther').value.trim();
    
    // ===== VALIDACIONES BÁSICAS =====
    if (!name) {
        //console.log('ERROR: name vacío'); 
        showAlert('Por favor ingresa tus nombres', 'error');
        autoHideAlert();
        return;
    }

    if (!last_name) {
        //console.log('ERROR: last_name vacío');  
        showAlert('Por favor ingresa tus apellidos', 'error');
        autoHideAlert();
        return;
    }

    if (!entered_code) {
        //console.log('ERROR: entered_code vacío');  
        showAlert('Por favor ingresa tu DNI', 'error');
        autoHideAlert();
        return;
    }

    if (!/^\d{8}$/.test(entered_code)) {
        //console.log('ERROR: DNI inválido:', entered_code);  
        showAlert('El DNI debe tener 8 caracteres numéricos', 'error');
        autoHideAlert();
        return;
    }

    if (!categorySelect) {
        //console.log('ERROR: categorySelect vacío');  
        showAlert('Por favor selecciona la categoría', 'error');
        autoHideAlert();
        return;
    }

    if (categorySelect === "otro" && !categoryOther) {
        //console.log('ERROR: categoryOther vacío');  
        showAlert('Por favor especifica la categoría', 'error');
        autoHideAlert();
        return;
    }

    if (!workAreaSelect) {
        //console.log('ERROR: workAreaSelect vacío');  
        showAlert('Por favor selecciona el área de trabajo', 'error');
        autoHideAlert();
        return;
    }

    if (workAreaSelect === "otro" && !workAreaOther) {
        //console.log('ERROR: workAreaOther vacío');  
        showAlert('Por favor especifica el área de trabajo', 'error');
        autoHideAlert();
        return;
    }


    // ===== NORMALIZACIÓN FINAL =====
    const category = categorySelect === "otro" ? categoryOther : categorySelect;
    const work_area = workAreaSelect === "otro" ? workAreaOther : workAreaSelect;

    const data = {
        name,
        last_name,
        entered_code,
        category,
        work_area
    };
    console.log('3. Datos listos:', data);
    setLoading(true);

    try {
        console.log('4. Antes de createUser'); 
        const result = await userService.createUser(data);
        console.log('5. Resultado recibido:', result);

        if (result.success) {
            console.log('6. Éxito - mostrando alerta'); 

            showAlert(result.message, 'success');
            autoHideAlert();
            
            sessionStorage.setItem('tempCode',entered_code);

            setTimeout(() => {
                window.location.href = '/pages/attendance/register_attendance.html';
            }, 2000);
        } else{
            console.log('6b. Success false:', result);
        }

    } catch (err) {
        console.log('ERROR catch:', err.message, err);
        const isNetwork = err instanceof TypeError;

        showAlert(
            isNetwork
                ? 'No se pudo conectar con el servidor'
                : err.message,
            'error'
        );

        autoHideAlert();

    } finally {
        console.log('7. Finally - desactivando loading');
        setLoading(false);
    }
}
