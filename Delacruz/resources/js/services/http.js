import axios from 'axios';

const http = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

// Attach the Bearer token to every request
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is invalid or expired, tell the app to log out
http.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/login');
        if (error.response?.status === 401 && !isLoginRequest) {
            window.dispatchEvent(new Event('auth:expired'));
        }
        return Promise.reject(error);
    }
);

export default http;