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
    const role = document.getElementById('role').value;

    // ===== NORMALIZACIÓN FINAL =====
    const data = {
        name,
        last_name,
        dni,
        category,
        work_area,
        code,
        role
    };
    setLoading(submitBtn, true);
    try {
        const user = await userService.createUser(data);
        showAlert(`¡Registro exitoso!`, 'success', 'alert');
        autoHideAlert('alert');
        form.reset();
    } catch (err) {
        const type = 
            err.status >= 500
            ? 'danger'
            : 'warning';
        showAlert(err.message, type, 'alert');
        autoHideAlert('alert');
    } finally {
        setLoading(submitBtn, false);
    }
}