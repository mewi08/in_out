/**
 *UI —  UI Helpers
 * Manipulación del DOM exclusiva de la pantalla.
 * Sin lógica de negocio; solo lee y escribe el DOM.
 */

export function showAlert(message, type, containerId='alert') {
    const alertBox = document.getElementById(containerId);
    if(!alertBox) return;

    alertBox.textContent = message;
    alertBox.className   = `alert ${type}`;
}

export function clearAlert(containerId='alert') {
    const el = document.getElementById(containerId);
    if(!el) return;
    el.className = 'alert';
    el.textContent = '';
}

export function setFieldError(field, show) {
    document.getElementById(field).classList.toggle('error', show);
    document.getElementById(`${field}-error`).classList.toggle('visible', show);
}

export function setLoading(element, loading) {
    element.disabled = loading;

    if(loading){
        element.dataset.originalText = element.textContent;
        element.textContent = 'Procesando...';
    }else{
        element.textContent = element.dataset.originalText || element.textContent;
    }
}

export function autoHideAlert(containerId = 'alert', delay = 5000){
    setTimeout(()=> clearAlert(containerId), delay)
}