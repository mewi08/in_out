const { ActivityLogRepository } = require('../infrastructure/activity_log.repository');
const { ActivityLog } = require('../domain/activity_log.model');

class ActivityLogService {

    static async create(data) {
        const log = new ActivityLog(data);

        return await ActivityLogRepository.create(
            log.toJSON()
        );
    }

    static async getRecent(limit) {
        return await ActivityLogRepository.findRecent(limit);
    }
}

module.exports = { ActivityLogService };