import { formatDate } from "../../shared/utils/date.helper.js"; 
import { workAreaService } from "../app/work_area.service.js";

export function renderTable(workArea, { onEdit, onToggle }){
    const tbody = document.getElementById('workAreaTableBody');
    if(!tbody){
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No hay registros
                </td>
            </tr>
        `
    }
    tbody.innerHTML = workArea.map(wa =>`
            <tr>
                <td class="td-muted">${wa.name}</td>
                <td class="td-muted">${wa.total_users}</td>
                <td>
                    <span class="badge ${wa.is_active ? 'badge-success' : 'badge-error'}">
                        ${wa.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="td-muted">${formatDate(wa.created_at)}</td>
                <td>
                    <div class="actions">
                        <button class="btn-icon"
                            data-action="edit"
                            data-id="${wa.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9e97a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen-icon lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>
                        </button>
                        <button class="btn-icon"
                            data-action="toggle"
                            data-id="${wa.id}"
                            data-active="${wa.is_active ? 'true' : 'false'}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9e97a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ban-icon lucide-ban"><circle cx="12" cy="12" r="10"/><path d="M4.929 4.929 19.07 19.071"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");

    tbody.onclick = (e)=>{
        const btn = e.target.closest('[data-action]');
        if(!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if(action === 'edit' && onEdit){
            onEdit(id);
        }

        if(action === 'toggle' && onToggle){
            onToggle(id, btn.dataset.active === 'true');
        }
    };
}

export async function renderSelect() {
    const data = await workAreaService.getAll('status=1');
    const select = document.getElementById('workArea');

    if (!select) return;

    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona un área";
    select.appendChild(defaultOption);

    data.forEach(wa => {
        const option = document.createElement("option");
        option.value = String(wa.id);
        option.textContent = wa.name;
        select.appendChild(option);
    });
}

export async function renderFilterAreas() {
    const data = await workAreaService.getAll('status=1');

    const select =
        document.getElementById('filterArea');

    if (!select) return;

    select.innerHTML =
        '<option value="">Todas las áreas</option>';

    data.forEach(area => {
        const option =
            document.createElement('option');

        option.value = area.id;
        option.textContent = area.name;

        select.appendChild(option);
    });
}