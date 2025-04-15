<script lang="ts" setup>
defineProps<{
    id: string;
}>();
</script>

<template>
    <div class="relative rounded-md aspect-book overflow-hidden">
        <slot name="custom" />
        <USkeleton class="absolute left-0 top-0 w-full h-full -z-10" />
        <img
            :src="`/api/attachments/${id}/content`"
            class="object-cover z-10 w-full h-full"
        >
    </div>
</template>
