class User {
    constructor({ name, last_name, dni, category, work_area }) {
        this.name = name?.trim();
        this.last_name = last_name?.trim();
        this.dni = dni?.trim();
        this.category = category?.trim();
        this.work_area = work_area?.trim();
    }

    // 🔹 normalizar datos
    toJSON() {
        return {
            name: this.name,
            last_name: this.last_name,
            dni: this.dni,
            category: this.category,
            work_area: this.work_area
        };
    }
}

module.exports = { User };