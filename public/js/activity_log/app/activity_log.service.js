/**
 * ACTIVITY_LOG — Application Service
 * Casos de uso: createRecord, getRecords.
 * Orquesta el dominio y los adaptadores; no conoce el DOM salvo redirects.
 */
import {api} from '../../shared/http/http.client.js';
export const activityLogService = {
    async getRecords() {
        const res = await api.get('/activity-logs/recent');
        if (!res.success) throw new Error(res.message);
        return res.data;
    }
};