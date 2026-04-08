class User {
    constructor({ name, last_name, entered_code, category, work_area }) {
        this.name = name?.trim();
        this.last_name = last_name?.trim();
        this.entered_code = entered_code?.trim();
        this.category = category?.trim();
        this.work_area = work_area?.trim();
    }

    getFullName() {
        return `${this.name} ${this.last_name}`;
    }

    isValidCode() {
        return /^\d{8}$/.test(this.entered_code);
    }

    // 🔹 normalizar datos
    toJSON() {
        return {
            name: this.name,
            last_name: this.last_name,
            entered_code: this.entered_code,
            category: this.category,
            work_area: this.work_area
        };
    }
}

module.exports = { User };