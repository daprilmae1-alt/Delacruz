<script setup>
import { reactive } from 'vue';

defineProps({
    loading: Boolean,
    errors: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['submit']);

const form = reactive({ email: '', password: '' });

const submit = () => emit('submit', { ...form });
</script>

<template>
    <form class="card login" @submit.prevent="submit">
        <h2>Login</h2>

        <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" :class="{ invalid: errors.email }" />
            <small v-if="errors.email" class="error-text">{{ errors.email[0] }}</small>
        </div>

        <div class="field">
            <label>Password</label>
            <input v-model="form.password" type="password" :class="{ invalid: errors.password }" />
            <small v-if="errors.password" class="error-text">{{ errors.password[0] }}</small>
        </div>

        <button type="submit" class="btn primary" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
        </button>
    </form>
</template>