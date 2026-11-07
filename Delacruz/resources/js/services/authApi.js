import http from './http';

export default {
    login: (credentials) => http.post('/login', credentials),
    logout: () => http.post('/logout'),
    me: () => http.get('/me'),
};