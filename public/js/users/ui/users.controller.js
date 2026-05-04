import { userService } from "../app/users.service.js";
import { loadPartial, renderFooter } from "../../shared/ui/partials.loader.js";
import { renderTable, updateStats } from "./user.table.js";
import { authService } from '../../auth/app/auth.service.js';
import { applyRolePermissions } from '../../shared/ui/admin.js';
let users = [];

const add = document.getElementById('newUserBtn');
add.addEventListener('click',()=>{
    window.location.href = '/pages/users/register_profile.html';
})

// ==== INIT ====
document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    await loadUsers();
}

// ==== LOAD ====
async function loadUsers() {
    try {
        users = await userService.getUsers();
        console.log(users);
        render();
    } catch (error) {
        console.error('Error cargando usuarios:', error.message);
    }
}

// ==== RENDER ====
function render() {
    updateStats(users);

    renderTable(users, {
        onEdit: handleEdit,
        onToggle: handleToggle
    });
    applyRolePermissions();
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