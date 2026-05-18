import { api } from '../../shared/http/http.client.js';

export const workAreaService = {

    async getAll(query) {
        const res = await api.get(`/work-area?${query}`);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async getById(id) {
        const res = await api.get(`/work-area/${id}`);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async createWorkArea(data) {
        const res = await api.post('/work-area', data);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async updateWorkArea(id, data) {
        const res = await api.patch(`/work-area/${id}`, data);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async updateWorkAreaStatus(id, is_active) {
        const res = await api.patch(`/work-area/${id}/status`, { is_active });
        if (!res.success) throw new Error(res.message);
        return res.data;
    }

};