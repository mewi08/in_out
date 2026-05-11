/**
 * ATTENDANCE — Application Service
 * Casos de uso: createRecord, getTodayHours.
 * Orquesta el dominio y los adaptadores; no conoce el DOM salvo redirects.
 */
import {api} from '../../shared/http/http.client.js';
export const attendanceService = {
    async createRecord(data){
        const res = await api.post(`/attendance`, data);
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async getTodayHours(user_id){
        const res = await api.get(`/attendance/today-hours/${user_id}`);
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async getTodayStatus(user_id){
        const res = await api.get(`/attendance/today-status/${user_id}`);
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async getAttendanceReport(page=1){
        const res = await api.get(`/attendance/reports/daily?page=${page}`);
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async exportAllUrl({ startDate, endDate }){
        return await api.getBlob( 
            `/attendance/reports/export?startDate=${startDate}&endDate=${endDate}`
        );
    },

    async exportByUserUrl({ user_id, startDate, endDate }) {
        return await api.getBlob( 
            `/attendance/reports/export/${user_id}?startDate=${startDate}&endDate=${endDate}`
        );
    }
};