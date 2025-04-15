<template>
    <div class="flex justify-between w-full gap-8 h-14 items-center">
        <NuxtLink to="/" class="font-semibold text-xl">Books</NuxtLink>
        <div class="hidden sm:flex flex-1 gap-8 items-center">
            <UtilSearchBar />
        </div>
        <UButton v-if="isAuthenticated" to="/create">Сдать книгу</UButton>
        <UtilAvatar />
    </div>
</template>

<script setup lang="ts">
import { useAuthCacheStore } from "~/store/auth";

const auth = useAuthCacheStore();

const { isAuthenticated } = storeToRefs(auth);
</script>
