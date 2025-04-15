<template>
    <div class="p-4">
        <h3 class="text-2xl font-semibold pb-4">
            Поиск по запросу {{ query }}
        </h3>
        <div
            v-if="status == 'success'"
            class="grid grid-cols-elementCard gap-2"
        >
            <AppElement
                v-for="element in data"
                :key="element.id"
                v-bind="element"
            />
        </div>
        <svg
            v-else-if="status == 'pending'"
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
        <span v-else>Ошибка</span>
    </div>
</template>

<script setup lang="ts">
import type { Book } from "~/types/book";

const route = useRoute();
const query = computed(() => route.query.q);
const { $api } = useNuxtApp();

definePageMeta({
    title: 'Поиск'
})

const { data, status } = useAsyncData<Book[]>(
    "query",
    () =>
        $api("/books/search", {
            query: {
                query: query.value,
            },
        }),
    {
        watch: [query],
    }
);
</script>
