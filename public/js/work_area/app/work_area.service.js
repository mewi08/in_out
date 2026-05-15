import { api } from '../../shared/http/http.client.js';

export const workAreaService = {

    async getWorkArea() {
        const res = await api.get('/work-area');
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async getById(id) {
        const res = await api.get(`/work-area/${id}`);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async createWorkArea(name) {
        const res = await api.post('/work-area', { name });
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async updateWorkArea(id, name) {
        const res = await api.patch(`/work-area/${id}`, { name });
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async updateWorkAreaStatus(id, is_active) {
        const res = await api.patch(`/work-area/${id}/status`, { is_active });
        if (!res.success) throw new Error(res.message);
        return res.data;
    }

};