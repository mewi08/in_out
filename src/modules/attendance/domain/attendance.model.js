class Attendance {
    constructor({ user_id, type, time_stamp, entered_code }) {
        this.user_id = user_id;
        this.type = type;
        this.entered_code = entered_code?.trim();
        this.time_stamp = time_stamp ? new Date(time_stamp) : new Date();
    }

    isCheckIn() {
        return this.type === 'check_in';
    }

    isCheckOut() {
        return this.type === 'check_out';
    }

    isValidType() {
        return ['check_in', 'check_out'].includes(this.type);
    }

    toJSON() {
        return {
            user_id: this.user_id,
            type: this.type,
            entered_code: this.entered_code
        };
    }
}

module.exports = { Attendance };