const API_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers }
    });

    const data = await res.json();

    if (!res.ok) {
        // Extraer mensaje de errors[] o message
        console.log('Error del servidor:', data);
        const msg = data.errors?.[0] || data.message || 'Error del servidor';
        throw new Error(msg);  // ✅ Ahora sí tiene .message
    }

    return data;
}

export const api = {
    get:    (url)       => request(url),
    post:   (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
    put:    (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
    patch:  (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url)       => request(url, { method: 'DELETE' }),
};