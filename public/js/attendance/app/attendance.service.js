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

    async getAttendanceReport(){
        const res = await api.get('/attendance/daily-report');
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async exportAllUrl({ startDate, endDate }){
        return await api.getBlob( 
            `/attendance/export?startDate=${startDate}&endDate=${endDate}`
        );
    },

    async exportByUserUrl({ dni, startDate, endDate }) {
        return await api.getBlob( 
            `/attendance/export/${dni}?startDate=${startDate}&endDate=${endDate}`
        );
    }
};