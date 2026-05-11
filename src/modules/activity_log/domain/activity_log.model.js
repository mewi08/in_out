class ActivityLog {
    constructor({
        action,
        description,
        user_id
    }) {
        this.action = action;
        this.description = description;
        this.user_id = user_id;
    }

    toJSON() {
        return {
            action: this.action,
            description: this.description,
            user_id: this.user_id
        };
    }
}

module.exports = { ActivityLog };