import { userService } from "../app/users.service.js";
import {
    showAlert,
    clearAlert,
    setLoading,
    autoHideAlert
} from "../../shared/ui/message.ui.js";

document.getElementById('registerForm').addEventListener('submit', handleSubmit);

const form = document.getElementById('registerForm');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');


backBtn.addEventListener('click', () => {
    window.location.href = '/pages/users/list_users.html';
});

function showError(message) {
    showAlert(message, 'warning', 'alert');
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
    const category = document.getElementById('category').value;
    const work_area = document.getElementById('workArea').value;
    
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

    if (!category) {
        showError('Por favor selecciona la categoría');
        return;
    }

    if (!work_area) {
        showError('Por favor selecciona el área de trabajo');
        return;
    }

    // ===== NORMALIZACIÓN FINAL =====
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
            'danger'
        );
        autoHideAlert('alert');
    } finally {
        setLoading(submitBtn, false);
    }
}