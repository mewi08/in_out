/**
 * SHARED — Partials Loader
 * Carga fragmentos HTML (partials) en el DOM.
 * Conoce rutas de UI pero no lógica de negocio.
 */
export async function loadPartial(containerId, url) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const res  = await fetch(url);
    const html = await res.text();
    container.innerHTML = html;
}
