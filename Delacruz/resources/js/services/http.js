import axios from 'axios';

const http = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

// Attach the token (if any) to every request
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;