import http from './http';

export default {
    getAll: () => http.get('/students'),
    create: (data) => http.post('/students', data),
    update: (id, data) => http.put(`/students/${id}`, data),
    remove: (id) => http.delete(`/students/${id}`),
};