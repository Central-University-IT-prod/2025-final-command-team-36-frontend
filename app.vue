<template>
    <div>
        <NuxtLoadingIndicator color="rgb(var(--color-primary-DEFAULT))" />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <UNotifications />
        <UModals />
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
useHead(() => ({
    title: `Books${route.meta?.title ? ' | ' + route.meta.title : ''}`
}))
</script>
