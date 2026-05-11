class User {
    constructor({ name, last_name, dni, category, work_area, code, role }) {
        this.name = name?.trim();
        this.last_name = last_name?.trim();
        this.dni = dni?.trim();
        this.category = category?.trim();
        this.work_area = work_area?.trim();
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
            work_area: this.work_area,
            code: this.code,
            role: this.role
        };
    }
}

module.exports = { User };