const { now } = require('../../../shared/utils/date');
class Attendance {
    constructor({ user_id, type, time_stamp, code }) {
        this.user_id = user_id;
        this.type = type;
        this.code = code?.trim();
        this.time_stamp = time_stamp ? new Date(time_stamp) : now().toJSDate();;
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
            code: this.code,
            time_stamp: this.time_stamp
        };
    }
}

module.exports = { Attendance };