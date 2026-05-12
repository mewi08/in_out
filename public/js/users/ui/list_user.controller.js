import { userService } from "../app/users.service.js";
import { attendanceService } from "../../attendance/app/attendance.service.js";
import { loadPartial, renderFooter, setActiveSidebar } from "../../shared/ui/partials.loader.js";
import { renderTable } from "./user.table.js";
import { authService } from '../../auth/app/auth.service.js';
import { applyRolePermissions } from '../../shared/ui/admin.js';
import { buildQuery } from '../../shared/utils/query.js';
import { debounce } from '../../shared/utils/debounce.js';
import { downloadFile } from '../../shared/utils/download.js';
let users = [];

const addUser = document.getElementById('newUserBtn');
const clear = document.getElementById('clearFilters');
const modalElement = document.getElementById('exportAttendanceModal');
const exportModal = new bootstrap.Modal(modalElement);
let currentPage = 1;
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    setActiveSidebar('usuarios');
    await loadUsers(currentPage);
    setupFilters();
    initPagination();

    addUser.addEventListener('click',()=>{
        window.location.href = '/pages/users/register_profile.html';
    });

    clear.addEventListener('click', async ()=>{
        currentPage = 1;
        clearFilters();
        await loadUsers(currentPage);
    });
}

function initPagination() {
    document.getElementById('nextBtn').addEventListener('click', async () => {
        currentPage++;
        await loadUsers(currentPage);
    });

    document.getElementById('prevBtn').addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await loadUsers(currentPage);
        }
    });
}

async function loadUsers(page=1) {
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

function render() {
    renderTable(users, {
        onEdit: handleEdit,
        onToggle: handleToggle,
        onExport: handleExport
    });
    applyRolePermissions();
}

function handleExport(userId) {
    document.getElementById('exportUserId').value = userId;
    exportModal.show();
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
        role: getValue('filterRole'),
        page: currentPage
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

async function exportAttendanceByUser() {
    try {
        const user_id =
            document.getElementById('exportUserId').value;
        const start =
            document.getElementById('exportStartDate').value;
        const end =
            document.getElementById('exportEndDate').value;
        if (!user_id || !start || !end) {
            console.log('Please complete all fields.');
            return;
        }
        const user = await userService.getUserById(user_id);
        const blob =
            await attendanceService.exportByUserUrl({
                user_id,
                startDate: start,
                endDate: end
            });
        downloadFile(
            blob,
            `attendance_report_${user.dni}_${start}_to_${end}.xlsx`
        );
    } catch (error) {
        console.error(
            'Error exporting attendance by user:',
            error
        );
    }
}

document.getElementById('confirmExportAttendance').addEventListener('click', async () => {
    await exportAttendanceByUser();
    exportModal.hide();
});