class User {
    constructor({ name, last_name, dni, category, work_area_id, code, role }) {
        this.name = name?.trim();
        this.last_name = last_name?.trim();
        this.dni = dni?.trim();
        this.category = category?.trim();
        this.work_area_id = work_area_id;
        this.code = code?.trim();
        this.role = role?.trim();
    }

    //normalizar datos
    toJSON() {
        return {
            name: this.name,
            last_name: this.last_name,
            dni: this.dni,
            category: this.category,
            work_area_id: this.work_area_id,
            code: this.code,
            role: this.role
        };
    }
}

module.exports = { User };