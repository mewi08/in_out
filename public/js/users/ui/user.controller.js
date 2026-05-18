import { userService } from "../app/users.service.js";
import { openModal, readForm } from "./user.modal.js";
import { renderSelect, renderFilterAreas } from "../../work_area/ui/work_area.render.js";
import { attendanceService } from "../../attendance/app/attendance.service.js";
import { loadPartial, renderFooter, setActiveSidebar } from "../../shared/ui/partials.loader.js";
import { renderTable } from "./user.table.js";
import { authService } from '../../auth/app/auth.service.js';
import { applyRolePermissions } from '../../shared/ui/admin.js';
import { buildQuery } from '../../shared/utils/query.js';
import { debounce } from '../../shared/utils/debounce.js';
import { downloadFile } from '../../shared/utils/download.js';
import {
    showAlert,
    clearAlert,
    setLoading,
    autoHideAlert
} from "../../shared/ui/message.ui.js";

let users = [];
let currentPage = 1;
let newUser;
let clear;
let exportModal;
let userModal;

document.addEventListener("DOMContentLoaded", async()=>{
    clear = document.getElementById('clearFilters');
    newUser = document.getElementById('newUserBtn');
    const exportAttendance = document.getElementById('exportAttendanceModal');
    const user = document.getElementById('modalUser');
    exportModal = new bootstrap.Modal(exportAttendance);
    userModal = new bootstrap.Modal(user);

    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    setActiveSidebar('usuarios');
    await renderFilterAreas();
    await loadUsers(currentPage);
    setupFilters();
    initPagination();
    setupModal();
    clear.addEventListener('click', async ()=>{
        currentPage = 1;
        clearFilters();
        await loadUsers(currentPage);
    });
});

function initPagination(){
    document.getElementById('nextBtn').addEventListener('click', async ()=>{
        currentPage ++;
        await loadUsers(currentPage);
    });
    
    document.getElementById('prevBtn').addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await loadUsers(currentPage);
        }
    });
}

async function loadUsers(page = 1) {
    try {
        const filters = getFilters(page);
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

async function handleEdit(id){
    const user = await userService.getUserById(id);
    await renderSelect();
    openModal(user);
    userModal.show();
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

function getFilters(currentPage) {
    const getValue = (id) => document.getElementById(id)?.value || '';

    return {
        search: getValue('searchInput'),
        status: getValue('filterStatus'),
        work_area_id: getValue('filterArea'),
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

async function saveUser(){
    const submitBtn = document.getElementById('saveBtn');
    try {
        clearAlert();
        setLoading(submitBtn, true);
        const data = readForm();
        if(data.id){
            await userService.updateUser(
                data.id,
                data
            );
            showAlert(
                'Usuario actualizado correctamente',
                'success',
                'userAlert'
            );
        } else {
            await userService.createUser(data);
            showAlert(
                'Usuario creado correctamente',
                'success',
                'userAlert'
            );
        }
        autoHideAlert('userAlert');
        await loadUsers(currentPage);
        setTimeout(() => {
            userModal.hide();
        }, 1000);
    } catch(err){
        const type =
            err.status >= 500
                ? 'danger'
                : 'warning';
        showAlert(err.message || 'Error al guardar usuario', type, 'userAlert');
        autoHideAlert('userAlert');
    } finally {
        setLoading(submitBtn, false);
    }
}

async function exportAttendanceByUser() {
    const confirm = document.getElementById('confirmExportAttendance');
    const user_id = document.getElementById('exportUserId').value;
    const start = document.getElementById('exportStartDate').value;
    const end = document.getElementById('exportEndDate').value;
    const user = await userService.getUserById(user_id);
    try {
        clearAlert();
        setLoading(confirm, true);
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
        setTimeout(() => {
            exportModal.hide();
        }, 1000);
    } catch (err) {
        const type =
            err.status >= 500
                ? 'danger'
                : 'warning';
        showAlert(err.message, type, 'exportAlert');
        autoHideAlert('exportAlert');
    } finally {
        setLoading(confirm, false);
    }
}


function setupModal(){
    if(newUser){
        newUser.addEventListener('click', async ()=> {
            await renderSelect(); 
            openModal();
            userModal.show();
        });
    }
    document.getElementById('saveBtn').addEventListener('click', ()=> saveUser());
    document.getElementById('confirmExportAttendance').addEventListener('click', ()=> exportAttendanceByUser())
}