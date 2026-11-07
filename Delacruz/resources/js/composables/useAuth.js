import { reactive, computed } from 'vue';
import authApi from '../services/authApi';

const loadUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
};

// Defined OUTSIDE the function so every component shares the same state
const state = reactive({
    user: loadUser(),
    token: localStorage.getItem('token'),
    loading: false,
});

export function useAuth() {
    const isLoggedIn = computed(() => !!state.token);
    const isAdmin = computed(() => state.user?.role === 'admin');

    const clearSession = () => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const login = async (email, password) => {
        state.loading = true;
        try {
            const res = await authApi.login({ email, password });
            const { user, token } = res.data.data;   // matches your AuthController
            state.user = user;
            state.token = token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } finally {
            state.loading = false;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();    // revokes the token in Laravel
        } catch {
            // even if the request fails, still log out locally
        } finally {
            clearSession();
        }
    };

    return { state, isLoggedIn, isAdmin, login, logout, clearSession };
}