<script setup>
defineProps({
    students: { type: Array, default: () => [] },
    loading: Boolean,
});
defineEmits(['edit', 'delete']);
</script>

<template>
    <div class="card">
        <h2>Student Records</h2>

        <p v-if="loading">Loading students...</p>
        <p v-else-if="!students.length">No students found.</p>

        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in students" :key="s.id">
                    <td>{{ s.id }}</td>
                    <td>{{ s.firstname }}</td>
                    <td>{{ s.email }}</td>
                    <td>{{ s.course }}</td>
                    <td>{{ s.Year_level }}</td>
                    <td class="row-actions">
                        <button class="btn small" @click="$emit('edit', s)">Edit</button>
                        <button class="btn small danger" @click="$emit('delete', s)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>