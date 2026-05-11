/**
 * AUTH — Front Session Service
 * Manejo básico de token y usuario logueado
 */

import { api } from "../../shared/http/http.client.js";

export const authService = {
    getToken() {
        return localStorage.getItem('token');
    },

    getCurrentUser() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token || !user) return null;
        return JSON.parse(user);
    },

    async login(code){
    const res = await api.post('/auth/login', { code });

    if(!res.success)throw new Error(res.message);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
},

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/pages/login.html';
    }
};