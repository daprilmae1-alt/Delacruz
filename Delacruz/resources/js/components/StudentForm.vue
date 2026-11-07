<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
    student: { type: Object, default: null },
    errors: { type: Object, default: () => ({}) },
    loading: Boolean,
});
const emit = defineEmits(['submit', 'cancel']);

const emptyForm = () => ({ firstname: '', email: '', course: '', Year_level: '' });
const form = reactive(emptyForm());

const isEditing = computed(() => !!props.student);

watch(
    () => props.student,
    (s) => {
        Object.assign(form, emptyForm());
        if (s) {
            Object.assign(form, {
                firstname: s.firstname,
                email: s.email,
                course: s.course,
                Year_level: s.Year_level,
            });
        }
    },
    { immediate: true }
);

const submit = () => emit('submit', { ...form });
</script>

<template>
    <form class="card" @submit.prevent="submit">
        <h2>{{ isEditing ? 'Edit Student' : 'Add Student' }}</h2>

        <div class="field">
            <label>First Name</label>
            <input v-model="form.firstname" type="text" :class="{ invalid: errors.firstname }" />
            <small v-if="errors.firstname" class="error-text">{{ errors.firstname[0] }}</small>
        </div>

        <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" :class="{ invalid: errors.email }" />
            <small v-if="errors.email" class="error-text">{{ errors.email[0] }}</small>
        </div>

        <div class="field">
            <label>Course</label>
            <input v-model="form.course" type="text" :class="{ invalid: errors.course }" />
            <small v-if="errors.course" class="error-text">{{ errors.course[0] }}</small>
        </div>

        <div class="field">
            <label>Year Level</label>
            <input v-model.number="form.Year_level" type="number" min="1"
                   :class="{ invalid: errors.Year_level }" />
            <small v-if="errors.Year_level" class="error-text">{{ errors.Year_level[0] }}</small>
        </div>

        <div class="actions">
            <button type="submit" class="btn primary" :disabled="loading">
                {{ loading ? 'Saving...' : isEditing ? 'Update' : 'Save' }}
            </button>
            <button v-if="isEditing" type="button" class="btn" @click="$emit('cancel')">
                Cancel
            </button>
        </div>
    </form>
</template>