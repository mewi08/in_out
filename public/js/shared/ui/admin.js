import { authService } from '../../auth/app/auth.service.js';

export function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const user = authService.getCurrentUser();
    if (!user) {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
}

export function applyRolePermissions() {
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        document.querySelectorAll('[data-admin]').forEach(el => el.remove());
    }else{
        const indexLink = document.querySelector('[data-page="index"]');
        if (indexLink) indexLink.remove();
    }
}