export function openModal(area = null){
    const isEdit = !!area;
    document.getElementById('modalTitle').textContent =
        isEdit
            ? 'Editar área de trabajo'
            : 'Nueva área de trabajo';
    document.getElementById('saveBtn').textContent =
        isEdit
            ? 'Actualizar'
            : 'Guardar';
    if(isEdit){
        document.getElementById('workAreaId').value = area.id;
        document.getElementById('areaName').value = area.name;
    } else {
        document.getElementById('areaForm').reset();
        document.getElementById('workAreaId').value = '';
    }
}

export function readForm(){
    return {
        id: document.getElementById('workAreaId').value || null,
        name: document.getElementById('areaName').value.trim(),
    };
}