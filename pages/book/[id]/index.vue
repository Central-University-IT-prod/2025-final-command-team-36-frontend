<template>
    <div class="p-4 mx-auto max-w-[1000px] space-y-4">
        <UtilAttachment :id="book.coverId" class="h-[400px] mx-auto group">
            <template #custom>
                <div class="opacity-0 cursor-pointer transition-all group-hover:opacity-100 flex items-center justify-center absolute right-0 w-12 h-12 p-3 rounded-bl-md bg-slate-100 dark:bg-slate-500" @click.prevent="favoriteStore.switchFavorite(book)">
                    <svg xmlns="http://www.w3.org/2000/svg" :fill="favorites.findIndex((elem) => elem.id == book.id) == -1 ? 'none' : 'currentColor'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </div>
            </template>
        </UtilAttachment>
        <h1 class="text-2xl">{{ book.name }}</h1>
        <div class="space-y-1">
            <div class="flex justify-between flex-col sm:flex-row opacity-90">
                <p>Автор: {{ book.author }}</p>
                <p>Жанр: {{ book.genre }}</p>
            </div>
            <div class="flex justify-between flex-col sm:flex-row opacity-80">
                <p>
                    Обложка:
                    {{
                        useCoverString[
                            book.cover as keyof typeof useCoverString
                        ]
                    }}
                </p>
                <p>Язык: {{ book.language }}</p>
            </div>
            <div class="flex justify-between flex-col sm:flex-row opacity-70">
                <p>Страницы: {{ book.pages }}</p>
                <p>
                    Размер:
                    {{ useSizeString[book.size as keyof typeof useSizeString] }}
                </p>
            </div>
            <div class="flex justify-between flex-col sm:flex-row opacity-60">
                <p>{{ book.publishingCompany }} - {{ book.editionYear }}</p>
                <p>ISBN: {{ book.isbn }}</p>
            </div>
        </div>
        <h2 class="text-2xl">Объявления</h2>
        <UCarousel v-if="instances" v-slot="{ item }" :items="instances">
            <AppInstance :instance="item" />
        </UCarousel>

        <svg
            v-else-if="instanceStatus == 'pending'"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
        >
            <circle cx="4" cy="12" r="3" fill="currentColor">
                <animate
                    id="svgSpinners3DotsScale0"
                    attributeName="r"
                    begin="0;svgSpinners3DotsScale1.end-0.25s"
                    dur="0.75s"
                    values="3;.2;3"
                />
            </circle>
            <circle cx="12" cy="12" r="3" fill="currentColor">
                <animate
                    attributeName="r"
                    begin="svgSpinners3DotsScale0.end-0.6s"
                    dur="0.75s"
                    values="3;.2;3"
                />
            </circle>
            <circle cx="20" cy="12" r="3" fill="currentColor">
                <animate
                    id="svgSpinners3DotsScale1"
                    attributeName="r"
                    begin="svgSpinners3DotsScale0.end-0.45s"
                    dur="0.75s"
                    values="3;.2;3"
                />
            </circle>
        </svg>
        <p v-else class="opacity-50">У этой книги пока нет объявлений...</p>
    </div>
</template>

<script lang="ts" setup>
import { useFavoritesStore } from "~/store/favorites";
import type { Book, BookInstance } from "~/types/book";

const route = useRoute();
const book = route.meta.book as Book;

definePageMeta({
    middleware: ["book"],
    title: 'Книга'
});

const { $api } = useNuxtApp();

const favoriteStore = useFavoritesStore()
const { favorites } = storeToRefs(favoriteStore)

const { data: instances, status: instanceStatus } = await useAsyncData(
    "instances",
    async () => {
        const data = await $api<BookInstance[]>(`/instances/book/${book.id}`);
        return data;
    }
);
</script>
