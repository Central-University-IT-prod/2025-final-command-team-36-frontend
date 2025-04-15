<script lang="ts" setup>
import type { NuxtError } from "#app";

defineProps<{
    error: NuxtError;
}>();
</script>

<template>
    <div class="flex flex-col gap-4 justify-center items-center h-screen">
        <h1 class="text-4xl font-bold">{{ error.statusCode }}</h1>
        <p class="opacity-50">{{ error.message }}</p>
        <UButton label="Домой" to="/" />
    </div>
</template>
