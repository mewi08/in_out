import { formatDate } from '../../shared/utils/date.helper.js';

const statTotal = document.getElementById("statTotal");
const statAdmin = document.getElementById("statAdmin");
const statEmployee = document.getElementById("statEmployee");
const statActive = document.getElementById("statActive");
const statInactive = document.getElementById("statInactive");

export function updateStats(stats) {
    if(statTotal){statTotal.textContent = stats[0].total}
    if(statAdmin){statAdmin.textContent = stats[0].admins}
    if(statEmployee){statEmployee.textContent = stats[0].employee}
    if(statActive){statActive.textContent = stats[0].active}
    if(statInactive){statInactive.textContent = stats[0].inactive}    
}

export function renderTable(users, { onEdit, onToggle } = {}) {
    const tbody = document.getElementById("usersTableBody");

    tbody.innerHTML = users.map(u => `
        <tr>
            <td class="td-muted">${u.last_name}</td>
            <td class="td-muted">${u.name}</td>
            <td class="td-muted">${u.dni}</td>
            <td class="td-muted">${u.category}</td>
            <td class="td-muted">${u.work_area}</td>
            <td class="td-muted">${u.code}</td>
            <td data-admin class="td-muted">${u.role}</td>
            <td data-admin>
                <span class="badge ${u.is_active ? 'badge-success' : 'badge-error'}">
                    ${u.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td data-admin class="td-muted">${formatDate(u.created_at)}</td>
            <td data-admin>
                <div class="actions">
                    <button class="btn-icon"
                        data-action="edit"
                        data-id="${u.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9e97a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen-icon lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>
                    </button>

                    <button class="btn-icon ${u.is_active ? 'danger' : ''}"
                        data-action="toggle"
                        data-id="${u.id}"
                        data-active="${u.is_active ? 'true' : 'false'}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9e97a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban-icon lucide-ban"><circle cx="12" cy="12" r="10"/><path d="M4.929 4.929 19.07 19.071"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    tbody.onclick = (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if (action === 'edit' && onEdit) {
            onEdit(id);
        }

        if (action === 'toggle' && onToggle) {
            onToggle(id, btn.dataset.active === 'true');
        }
    };
}