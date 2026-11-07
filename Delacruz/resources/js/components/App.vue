<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import studentApi from '../services/studentApi';
import { useAuth } from '../composables/useAuth';
import AlertMessage from './AlertMessage.vue';
import LoginForm from './LoginForm.vue';
import StudentForm from './StudentForm.vue';
import StudentTable from './StudentTable.vue';

const { state: auth, isLoggedIn, isAdmin, login, logout, clearSession } = useAuth();

const students = ref([]);
const selected = ref(null);
const errors = ref({});
const loginErrors = ref({});
const loading = ref(false);
const saving = ref(false);
const formKey = ref(0);
const alert = ref({ type: 'success', message: '' });

const notify = (message, type = 'success') => {
    alert.value = { type, message };
    setTimeout(() => (alert.value.message = ''), 4000);
};

// ---------- AUTH ----------
const handleLogin = async (credentials) => {
    loginErrors.value = {};
    try {
        await login(credentials.email, credentials.password);
        notify(`Welcome, ${auth.user.name}!`);
        await fetchStudents();
    } catch (e) {
        if (e.response?.status === 422) {
            loginErrors.value = e.response.data.errors;
            notify('Please enter a valid email and password.', 'error');
        } else if (e.response?.status === 401) {
            notify(e.response.data.message, 'error');
        } else {
            notify('Cannot reach the server.', 'error');
        }
    }
};

const handleLogout = async () => {
    await logout();
    students.value = [];
    selected.value = null;
    errors.value = {};
    notify('You have been logged out.');
};

const onSessionExpired = () => {
    clearSession();
    students.value = [];
    notify('Session expired. Please log in again.', 'error');
};

// ---------- STUDENTS ----------
const fetchStudents = async () => {
    loading.value = true;
    try {
        const res = await studentApi.getAll();
        students.value = res.data.data;
    } catch (e) {
        if (e.response?.status !== 401) notify('Failed to load students.', 'error');
    } finally {
        loading.value = false;
    }
};

const saveStudent = async (payload) => {
    if (!isAdmin.value) return;
    saving.value = true;
    errors.value = {};
    try {
        const res = selected.value
            ? await studentApi.update(selected.value.id, payload)
            : await studentApi.create(payload);

        notify(res.data.message);
        selected.value = null;
        formKey.value++;
        await fetchStudents();
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors;
            notify('Please fix the validation errors.', 'error');
        } else if (e.response?.status !== 401) {
            notify(e.response?.data?.message ?? 'Something went wrong.', 'error');
        }
    } finally {
        saving.value = false;
    }
};

const deleteStudent = async (student) => {
    if (!isAdmin.value) return;
    if (!confirm(`Delete ${student.firstname}?`)) return;
    try {
        const res = await studentApi.remove(student.id);
        notify(res.data.message);
        if (selected.value?.id === student.id) selected.value = null;
        await fetchStudents();
    } catch (e) {
        if (e.response?.status !== 401) {
            notify(e.response?.data?.message ?? 'Failed to delete student.', 'error');
        }
    }
};

const editStudent = (student) => {
    selected.value = student;
    errors.value = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
    selected.value = null;
    errors.value = {};
};

onMounted(() => {
    window.addEventListener('auth:expired', onSessionExpired);
    if (isLoggedIn.value) fetchStudents();
});

onBeforeUnmount(() => {
    window.removeEventListener('auth:expired', onSessionExpired);
});
</script>

<template>
    <div class="container">
        <h1>Student Management System</h1>

        <div v-if="isLoggedIn" class="topbar">
            <span>
                {{ auth.user?.name }}
                <span :class="['badge', isAdmin ? 'admin' : 'user']">
                    {{ isAdmin ? 'Administrator' : 'Regular User' }}
                </span>
            </span>
            <button class="btn small" @click="handleLogout">Logout</button>
        </div>

        <AlertMessage
            :type="alert.type"
            :message="alert.message"
            @close="alert.message = ''"
        />

        <LoginForm
            v-if="!isLoggedIn"
            :loading="auth.loading"
            :errors="loginErrors"
            @submit="handleLogin"
        />

        <template v-else>
            <StudentForm
                v-if="isAdmin"
                :key="formKey"
                :student="selected"
                :errors="errors"
                :loading="saving"
                @submit="saveStudent"
                @cancel="cancelEdit"
            />
            <p v-else class="card info">
                You are logged in as a Regular User. You have view-only access.
            </p>

            <StudentTable
                :students="students"
                :loading="loading"
                :can-manage="isAdmin"
                @edit="editStudent"
                @delete="deleteStudent"
            />
        </template>
    </div>
</template>