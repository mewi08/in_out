import { userService } from "../app/users.service.js";
import { attendanceService } from "../../attendance/app/attendance.service.js";
import { loadPartial, renderFooter, setActiveSidebar } from "../../shared/ui/partials.loader.js";
import { renderTable } from "./user.table.js";
import { authService } from '../../auth/app/auth.service.js';
import { applyRolePermissions } from '../../shared/ui/admin.js';
import { buildQuery } from '../../shared/utils/query.js';
import { debounce } from '../../shared/utils/debounce.js';
let users = [];

const addUser = document.getElementById('newUserBtn');
const clear = document.getElementById('clearFilters');

// ==== INIT ====
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    setActiveSidebar('usuarios');
    await loadUsers();
    setupFilters();

    addUser.addEventListener('click',()=>{
        window.location.href = '/pages/users/register_profile.html';
    });

    clear.addEventListener('click',()=>{
        clearFilters();
        loadUsers();
    });
}

// ==== LOAD ====
async function loadUsers() {
    try {
        const filters = getFilters();
        const query = buildQuery(filters);

        const isAdmin = authService.getCurrentUser()?.role === 'admin';
        users = isAdmin
            ? await userService.getUsers(query)
            : await userService.getActiveUsers(query);
            render();
    } catch (error) {
        console.error('Error cargando usuarios:', error.message);
    }
}

// ==== RENDER ====
function render() {
    renderTable(users, {
        onEdit: handleEdit,
        onToggle: handleToggle,
        export: handleExport
    });
    applyRolePermissions();
}

function handleExport(dni) {
    console.log('Exportar asistencias para usuario:',dni);
    //await attendanceService.exportByUser()
}

function handleEdit(id) {
    console.log('Editar usuario:', id);
    window.location.href = `/pages/users/update_profile.html?id=${id}`;
}

async function handleToggle(id, isActive) {
    const newStatus = isActive === true || isActive === "true"
        ? false
        : true;
    await userService.updateUserStatus(id, newStatus);
    await loadUsers();
}

function setupFilters() {
    document.getElementById('searchInput')
        .addEventListener('input', debounce(loadUsers, 300));

    document.querySelectorAll('#filterStatus, #filterArea, #filterCategory, #filterRole')
        .forEach(el => {
            el.addEventListener('change', loadUsers);
        });
}

function getFilters() {
    const getValue = (id) => document.getElementById(id)?.value || '';

    return {
        search: getValue('searchInput'),
        status: getValue('filterStatus'),
        area: getValue('filterArea'),
        category: getValue('filterCategory'),
        role: getValue('filterRole')
    };
}

function clearFilters() {
    const ids = [
        'searchInput',
        'filterStatus',
        'filterArea',
        'filterCategory',
        'filterRole'
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });
}