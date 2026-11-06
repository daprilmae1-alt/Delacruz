<script setup>
import { ref, onMounted } from 'vue';
import studentApi from '../services/studentApi';
import AlertMessage from './AlertMessage.vue';
import StudentForm from './StudentForm.vue';
import StudentTable from './StudentTable.vue';

const students = ref([]);
const selected = ref(null);   // student being edited
const errors = ref({});       // validation errors from Laravel
const loading = ref(false);   // loading the list
const saving = ref(false);    // saving the form
const formKey = ref(0);       // changing this resets the form
const alert = ref({ type: 'success', message: '' });

const notify = (message, type = 'success') => {
    alert.value = { type, message };
    setTimeout(() => (alert.value.message = ''), 4000);
};

// READ
const fetchStudents = async () => {
    loading.value = true;
    try {
        const res = await studentApi.getAll();
        students.value = res.data.data;
    } catch (e) {
        notify('Failed to load students.', 'error');
    } finally {
        loading.value = false;
    }
};

// CREATE + UPDATE
const saveStudent = async (payload) => {
    saving.value = true;
    errors.value = {};
    try {
        const res = selected.value
            ? await studentApi.update(selected.value.id, payload)
            : await studentApi.create(payload);

        notify(res.data.message);
        selected.value = null;
        formKey.value++;              // clear the form
        await fetchStudents();
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors;
            notify('Please fix the validation errors.', 'error');
        } else {
            notify(e.response?.data?.message ?? 'Something went wrong.', 'error');
        }
    } finally {
        saving.value = false;
    }
};

// DELETE
const deleteStudent = async (student) => {
    if (!confirm(`Delete ${student.firstname}?`)) return;
    try {
        const res = await studentApi.remove(student.id);
        notify(res.data.message);
        if (selected.value?.id === student.id) selected.value = null;
        await fetchStudents();
    } catch (e) {
        notify(e.response?.data?.message ?? 'Failed to delete student.', 'error');
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

onMounted(fetchStudents);
</script>

<template>
    <div class="container">
        <h1>Student Management System</h1>

        <AlertMessage
            :type="alert.type"
            :message="alert.message"
            @close="alert.message = ''"
        />

        <StudentForm
            :key="formKey"
            :student="selected"
            :errors="errors"
            :loading="saving"
            @submit="saveStudent"
            @cancel="cancelEdit"
        />

        <StudentTable
            :students="students"
            :loading="loading"
            @edit="editStudent"
            @delete="deleteStudent"
        />
    </div>
</template>