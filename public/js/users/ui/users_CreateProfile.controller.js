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

const form = document.getElementById('registerForm');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');


backBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
});

function showError(message) {
    showAlert(message, 'error', 'alert');
    autoHideAlert('alert');
}

async function handleSubmit(e) {
    e.preventDefault();
    clearAlert('alert');

    // ===== LECTURA DE DATOS =====
    const name = document.getElementById('name').value.trim();
    const last_name = document.getElementById('lastName').value.trim();
    const dni  = document.getElementById('dni').value.trim();
    const code = document.getElementById('code').value.trim();
    
    const categorySelect = document.getElementById('category').value;
    const categoryOther = document.getElementById('categoryOther').value.trim();

    const workAreaSelect = document.getElementById('workArea').value;
    const workAreaOther = document.getElementById('workAreaOther').value.trim();
    
    // ===== VALIDACIONES BÁSICAS =====
    if (!name) {
        showError('Por favor ingresa tus nombres');
        return;
    }

    if (!last_name) { 
        showError('Por favor ingresa tus apellidos');
        return;
    }

    if (!dni) {
        showError('Por favor ingresa tu DNI');
        return;
    }

    if (!/^\d{8}$/.test(dni)) {
        showError('El DNI debe tener 8 caracteres numéricos');
        return;
    }

    if(!code){
        showError('Por favor ingresa el código');
        return;
    }

    if (!categorySelect) {
        showError('Por favor selecciona la categoría');
        return;
    }

    if (categorySelect === "otro" && !categoryOther) {
        showError('Por favor especifica la categoría');
        return;
    }

    if (!workAreaSelect) {
        showError('Por favor selecciona el área de trabajo');
        return;
    }

    if (workAreaSelect === "otro" && !workAreaOther) {
        showError('Por favor especifica el área de trabajo');
        return;
    }

    // ===== NORMALIZACIÓN FINAL =====
    const category = categorySelect === "otro" ? categoryOther : categorySelect;
    const work_area = workAreaSelect === "otro" ? workAreaOther : workAreaSelect;
    const data = {
        name,
        last_name,
        dni,
        category,
        work_area,
        code
    };
    setLoading(submitBtn, true);
    try {
        const user = await userService.createUser(data);
        showAlert(`¡Registro exitoso!`, 'success', 'alert');
        autoHideAlert('alert');
        form.reset();
    } catch (err) {
        const isNetwork = err instanceof TypeError;
        showAlert(
            isNetwork
                ? 'No se pudo conectar con el servidor'
                : err.message,
            'error'
        );
        autoHideAlert('alert');
    } finally {
        setLoading(submitBtn, false);
    }
}