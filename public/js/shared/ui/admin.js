import { authService } from '../../auth/app/auth.service.js';

export function applyRolePermissions() {
    const user = authService.getCurrentUser();

    if (!user || user.role !== 'admin') {
        document.querySelectorAll('[data-admin]').forEach(el => el.remove());
    }else{
        document.querySelector('[data-page="index"]').remove();
    }
}