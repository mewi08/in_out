import { authService } from '../../auth/app/auth.service.js';

export function requireAuth() {
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    if (!token || !user) {
        authService.logout();
        return false;
    }
    return true;
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