/**
 * USERS — Application Service
 * Casos de uso: getUsers, getUserById, getUserByCode, createUser, updateUser, updateUserStatus.
 * Orquesta el dominio y los adaptadores; no conoce el DOM salvo redirects.
 */
export const userService = {
    getUsers() {
        return api.get('/user');
    },

    getUserById(id) {
        return api.get(`/user/${id}`);
    },

    async getUserByCode(code) {
        const res = await api.get(`/user/code/${code}`);
        if (!res.success) throw new Error(res.message);
        return res.data;
    },

    createUser(data) {
        return api.post('/user', data);
    },

    updateUser(id, data) {
        return api.put(`/user/${id}`, data);
    },

    updateUserStatus(id, status) {
        return api.patch(`/user/${id}/status`, { status });
    }
};