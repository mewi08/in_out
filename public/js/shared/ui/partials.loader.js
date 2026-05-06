/**
 * SHARED — Partials Loader
 * Carga fragmentos HTML (partials) en el DOM.
 * Conoce rutas de UI pero no lógica de negocio.
 */
import { authService } from "../../auth/app/auth.service.js";

export async function loadPartial(containerId, url) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const res  = await fetch(url);
    const html = await res.text();
    container.innerHTML = html;
}

export function renderFooter() {
    const footer = document.getElementById('sidebarFooter');
    const token = localStorage.getItem('token');

    if (!footer) return;

    if (token) {
        footer.innerHTML = `
            <a class="sidebar-link" href="#" id="logoutLink">Cerrar sesión</a>
        `;

        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    } else {
        footer.innerHTML = `
            <a class="sidebar-link" href="/pages/login.html">Administración</a>
        `;
    }
}

export function setActiveSidebar(page) {
    document
        .querySelector(`[data-page="${page}"]`)
        ?.classList.add('active');
}