/**
 *UI —  UI Helpers
 * Manipulación del DOM exclusiva de la pantalla.
 * Sin lógica de negocio; solo lee y escribe el DOM.
 */

export function showAlert(message, type, containerId='alert') {
    const alertBox = document.getElementById(containerId);
    alertBox.textContent = message;
    alertBox.className   = `alert ${type}`;
}

/** Limpia cualquier alerta visible. */
export function clearAlert(containerId='alert') {
    document.getElementById(containerId).className = 'alert';
}

export function setFieldError(field, show) {
    document.getElementById(field).classList.toggle('error', show);
    document.getElementById(`${field}-error`).classList.toggle('visible', show);
}

export function setLoading(loading, btnId='submitBtn') {
    const btn    = document.getElementById(btnId);
    btn.disabled = loading;
    btn.classList.toggle('loading', loading);
}

export function autoHideAlert(containerId = 'alert', delay = 5000){
    setTimeout(()=> clearAlert(containerId), delay)
}