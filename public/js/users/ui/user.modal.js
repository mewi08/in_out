export function openModal(user = null){
    const isEdit = !!user;
    document.getElementById('modalTitle').textContent =
        isEdit
            ? 'Editar usuario'
            : 'Crear usuario';
    document.getElementById('saveBtn').textContent =
        isEdit
            ? 'Actualizar'
            : 'Guardar';
    if(isEdit){
        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('lastName').value = user.last_name;
        document.getElementById('dni').value = user.dni;
        document.getElementById('code').value = user.code;
        document.getElementById('category').value = user.category;
        document.getElementById('workArea').value = String(user.work_area_id);
        document.getElementById('role').value = user.role;
    } else {
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
    }
}

export function readForm(){
        return {
        id: document.getElementById('userId').value || null,
        name: document.getElementById('name').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        dni: document.getElementById('dni').value.trim(),
        code: document.getElementById('code').value.trim(),
        category: document.getElementById('category').value,
        work_area_id: document.getElementById('workArea').value,
        role: document.getElementById('role').value
    };
}