/**
 * USERS — Application Service
 * Casos de uso: getUsers, getUserById, getUserByCode, createUser, updateUser, updateUserStatus.
 * Orquesta el dominio y los adaptadores; no conoce el DOM salvo redirects.
 */
import { api } from '../../shared/http.client.js';

export const userService = {
    async getUsers() {
        const res = await api.get('/user');
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async getUserById(id) {
        const res = await api.get(`/user/${id}`);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async getUserByDni(dni) {
        const res = await api.get(`/user/${dni}`);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async createUser(data) {
        const res = await api.post('/user', data);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async verifySecurityCode(security_code){
        const res = await api.post('/user/verify-security-code', {security_code});
        if(!res.success) throw new Error(res.message);
        return res.data;
    },

    async updateUser(id, data) {
        const res = await api.put(`/user/${id}`, data);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    async updateUserStatus(id, status) {
        const res = await api.patch(`/user/${id}/status`, { status });
        if (!res.success) throw new Error(res.message);
        return res.data;
    },
};