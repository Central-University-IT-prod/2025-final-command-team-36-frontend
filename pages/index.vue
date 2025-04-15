<template>
    <div class="px-4">
        <div class="sm:hidden pt-2">
            <UtilSearchBar />
        </div>
        <div class="py-4">
            <div
                v-if="
                    isAuthenticated &&
                    recommendationsData &&
                    recommendationsData.length > 0
                "
            >
                <h3 class="text-2xl font-semibold pb-4">
                    Рекомендации для вас
                </h3>
                <UCarousel
                    v-if="recommendationsStatus == 'success'"
                    v-slot="{ item: element }"
                    :items="recommendationsData"
                >
                    <AppElement :key="element.id" v-bind="element" />
                </UCarousel>
                <svg
                    v-else-if="recommendationsStatus == 'pending'"
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
            <div>
                <h3 class="text-2xl font-semibold py-4">В тренде 🔥</h3>
                <UCarousel
                    v-if="trendsData && trendsStatus == 'success'"
                    v-slot="{ item: element }"
                    :items="trendsData"
                >
                    <NuxtLink
                        v-if="element?.l"
                        to="/hot"
                        class="px-4 h-full flex items-center"
                    >
                        <span class="mr-2 hidden sm:inline"> Еще тренды </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </NuxtLink>
                    <AppElement v-else :key="element.id" v-bind="element" />
                </UCarousel>
                <svg
                    v-else-if="trendsStatus == 'pending'"
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
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthCacheStore } from "~/store/auth";
import type { Book } from "~/types/book";

const auth = useAuthCacheStore();
const isAuthenticated = toRef(() => auth.isAuthenticated);

const { data: recommendationsData, status: recommendationsStatus } =
    useApiFetch<Book[]>("/books/recommendations", {
        query: { limit: 10, offset: 0 },
    });
const { data: trendsData, status: trendsStatus } =
    useApiFetch<Book[]>("/books/trends");
</script>
