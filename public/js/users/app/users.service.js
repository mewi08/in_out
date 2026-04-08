/**
 * USERS — Application Service
 * Casos de uso: getUsers, getUserById, getUserByCode, createUser, updateUser, updateUserStatus.
 * Orquesta el dominio y los adaptadores; no conoce el DOM salvo redirects.
 */
import { api } from '../../shared/http.client.js'
export const userService ={
    async getUsers(){
        return await api.get('/user');
    },

    async getUserById(id){
        return await api.get(`/user/${id}`);
    },

    async getUserByCode(code){
        return await api.get(`/user/code/${code}`)
    },

    async createUser(data){
        return await api.post('/user',data);
    },

    async updateUser(id,data){
        return await api.put(`/user/${id}`,data);
    },
    
    async updateUserStatus(id){
        return await api.patch(`/user/${id}/status`)
    }
}