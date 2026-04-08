import {api} from '../../shared/http.client.js';
export const attendanceService = {
    /**
     * Crear registro de entrada o salida
     * @param {Object} data - { user_id, type: 'entry'|'exit', timestamp }
     */
    async createRecord(data){
        return await api.post(`/attendance`,data);
    },

    async getTodayHours(user_id){
        return await api.get(`attendance/${user_id}`);
    }
}