<template>
    <NuxtLink :to="'/book/' + id" class="flex flex-col w-36">
        <div class="flex justify-center pb-1">
            <UtilAttachment :id="coverId" class="w-5/6 group">
                <template #custom>
                    <div class="opacity-0 transition-all group-hover:opacity-100 flex items-center justify-center absolute right-0 w-9 h-9 p-1 rounded-bl-md bg-slate-100 dark:bg-slate-500" @click.prevent="favoriteStore.switchFavorite(props)">
                        <svg xmlns="http://www.w3.org/2000/svg" :fill="favorites.findIndex((elem) => elem.id == id) == -1 ? 'none' : 'currentColor'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </div>
                </template>
            </UtilAttachment>
        </div>
        <span class="text-center font-semibold">{{ name }}</span>
        <span class="text-center text-sm text-gray-500">{{ author }}</span>
        <span class="text-center text-sm text-gray-500">{{ genre }}</span>
    </NuxtLink>
</template>

<script setup lang="ts">
import { useFavoritesStore } from "~/store/favorites";
import type { Book } from "~/types/book";

const favoriteStore = useFavoritesStore()
const { favorites } = storeToRefs(favoriteStore)

const props = defineProps<Book>();
</script>
