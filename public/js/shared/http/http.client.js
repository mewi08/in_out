const API_URL = 'http://localhost:3000/api';
import { authService } from "../../auth/app/auth.service.js";

async function request(endpoint, options = {}) {
    const token = authService.getToken();
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: { 
                'Content-Type': 'application/json', 
                ...(token && { Authorization: `Bearer ${token}`}),
                ...options.headers }
        });

        const data = await res.json();

        if (!res.ok) {
            let msg = 'Error del servidor';
            
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                msg = data.errors.join(', ');
            } else if (data.message && typeof data.message === 'string') {
                msg = data.message;
            } else if (data.error && typeof data.error === 'string') {
                msg = data.error;
            } else if (typeof data === 'string') {
                msg = data;
            }
            throw new Error(msg);
        }

        if (data.success === false && data.error) {
            throw new Error(data.error);
        }

        return data;

    } catch (err) {
        if (err instanceof TypeError) {
            throw new Error('No se pudo conectar con el servidor');
        }

        throw err;
    }
}

async function requestBlob(endpoint, options = {}) {
    const token = authService.getToken();
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            }
        });

        if (!res.ok) {
            throw new Error('Error descargando archivo');
        }

        return await res.blob();

    } catch (err) {
        if (err instanceof Error && err.message !== 'Error descargando archivo') {
            throw err;
        }
        throw new Error('No se pudo conectar con el servidor');
    }
}

export const api = {
    get:     (url)       => request(url),
    post:    (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
    put:     (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
    patch:   (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete:  (url)       => request(url, { method: 'DELETE' }),
    getBlob: (url)       => requestBlob(url), 
};