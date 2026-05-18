import { workAreaService } from "../app/work_area.service.js";
import { openModal, readForm } from './work_area.modal.js';
import { renderTable } from "./work_area.render.js";
import { loadPartial, renderFooter } from "../../shared/ui/partials.loader.js";
import { autoHideAlert, clearAlert, setLoading, showAlert } from "../../shared/ui/message.ui.js";
import { debounce } from "../../shared/utils/debounce.js";
import { applyRolePermissions } from "../../shared/ui/admin.js";
import { buildQuery } from "../../shared/utils/query.js";
import { authService } from "../../auth/app/auth.service.js";

let workAreas = [];
let currentPage = 1;
let clear;
let workAreaModal;

document.addEventListener('DOMContentLoaded', async()=>{
    clear = document.getElementById('clearFilters');
    const workArea = document.getElementById('workAreaModal');
    workAreaModal = new bootstrap.Modal(workArea);
    await loadPartial('sidebar-container', '/partials/sidebar.html');
    renderFooter();
    applyRolePermissions();
    await loadWorkAreas(currentPage);
    setupFilters();
    initPagination();
    setupModal();
    clear.addEventListener('click', async ()=>{
        currentPage = 1;
        clearFilters();
        await loadWorkAreas(currentPage);
    })
})

function initPagination(){
    document.getElementById('nextBtn').addEventListener('click', async ()=>{
        currentPage ++;
        await loadWorkAreas(currentPage);
    });

    document.getElementById('prevBtn').addEventListener('click', async () =>{
        if(currentPage > 1){
            currentPage --;
            await loadWorkAreas(currentPage);
        }
    });
}

async function loadWorkAreas(page = 1){
    try{
        const filters = getFilters(page);
        const query = buildQuery(filters);
        const isAdmin = authService.getCurrentUser()?.role === 'admin';
        workAreas = isAdmin
            ? await workAreaService.getAll(query)
            : await workAreaService.getAll('status=1');
        render()
    }catch(error){
        console.error('Error cargando áreas de trabajo', error.message);
    }
}

function render(){
    renderTable(workAreas, {
        onEdit: handleEdit,
        onToggle: handleToggle
    });
}

async function handleEdit(id){
    const area = await workAreaService.getById(id);
    openModal(area);
    workAreaModal.show();
}

async function handleToggle(id, isActive) {
    const newStatus = isActive === true || isActive == 'true'
        ? false
        : true;
    await workAreaService.updateWorkAreaStatus(id, newStatus);
    await loadWorkAreas();
} 

async function saveWorkArea(){
    const submitBtn = document.getElementById('saveBtn');
    try {
        clearAlert();
        setLoading(submitBtn, true);
        const data = readForm();
        console.log(data)
        if(data.id){
            await workAreaService.updateWorkArea(
                data.id,
                data
            );
        showAlert('Área actualizada correctamente', 'success', 'alert');
        } else {
            await workAreaService.createWorkArea(data);
            showAlert('Área creada correctamente', 'success', 'alert');
        }
        autoHideAlert('alert');
        await loadWorkAreas();
        setTimeout(() => {
            workAreaModal.hide();
        }, 1000);
    } catch(err){
        const type =
            err.status >= 500
                ? 'danger'
                : 'warning';
        showAlert(err.message || 'Error al guardar área', type, 'alert');
        autoHideAlert('alert');
    } finally {
        setLoading(submitBtn, false);
    }
}

function setupFilters(){
    document.getElementById('searchInput')
        .addEventListener('input', debounce(loadWorkAreas, 300));

    document.querySelectorAll('#filterStatus')
        .forEach(el => {
            el.addEventListener('change', loadWorkAreas);
        });
}
function getFilters(currentPage){
    const getValue = (id) => document.getElementById(id)?.value || '';

    return {
        search: getValue('searchInput'),
        status: getValue('filterStatus'),
        page: currentPage
    };
}

function clearFilters() {
    const ids = [
        'searchInput',
        'filterStatus'
    ];

    ids.forEach(id =>{
        const el = document.getElementById(id);
        if(!el) return;
        if(el.tagName === 'SELECT'){
            el.selectedIndex = 0;
        }else{
            el.value = '';
        }
    })
}

function setupModal(){
    document.getElementById('newAreaBtn').addEventListener('click', ()=>{
        openModal();
        workAreaModal.show();
    });
    document.getElementById('saveBtn').addEventListener('click', ()=> saveWorkArea());
}