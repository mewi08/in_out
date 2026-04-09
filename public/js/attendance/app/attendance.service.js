/**
 * ATTENDANCE — Application Service
 * Casos de uso: createRecord, getTodayHours.
 * Orquesta el dominio y los adaptadores; no conoce el DOM salvo redirects.
 */
import {api} from '../../shared/http.client.js';
export const attendanceService = {
    /**
     * Crear registro de entrada o salida
     * @param {Object} data - { user_id, type: 'entry'|'exit', timestamp }
     */
    async createRecord(data){
        const res = await api.post(`/attendance`, data);
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async getTodayHours(user_id){
        const res = await api.get(`/attendance/${user_id}`);
        if(!res.success) throw new Error(res.message);
        return res.data;
    }
};