<script setup>
defineProps({
    type: { type: String, default: 'success' },
    message: { type: String, default: '' },
});
defineEmits(['close']);
</script>

<template>
    <div v-if="message" :class="['alert', type]">
        <span>{{ message }}</span>
        <button class="close" @click="$emit('close')">&times;</button>
    </div>
</template>