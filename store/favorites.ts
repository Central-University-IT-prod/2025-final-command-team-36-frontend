import { defineStore } from "pinia";
import { useAuthCacheStore } from "./auth";
import type { Book } from "~/types/book";

export const useFavoritesStore = defineStore(
    "favorites",
    () => {
        const favorites = ref<Book[]>([]);
        const { user } = toRefs(useAuthCacheStore());
        const { $api } = useNuxtApp();

        const updateFavorites = async () => {
            const data = await $api<Book[]>("/books/favorites");
            favorites.value = data;
        };

        watch(user, updateFavorites);

        updateFavorites();

        const switchFavorite = async (book: Book) => {
            let idx = favorites.value.findIndex((el) => el.id == book.id)
            if (idx == -1) {
                await $api(`/books/${book.id}/favorite`, {
                    method: "POST"
                }).then(() => {
                    if (favorites.value.findIndex((el) => el.id == book.id) == -1) {
                        favorites.value.push(book)
                    }
                })
            } else {
                await $api(`/books/${book.id}/unfavorite`, {
                    method: "POST"
                }).then(() => {
                    while (idx != -1) {
                        idx = favorites.value.findIndex((el) => el.id == book.id)
                        if (idx != -1) {
                            favorites.value.splice(idx, 1)
                        }
                    }
                })
            }
        }

        return { favorites, switchFavorite };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.cookies({
                sameSite: "strict",
                maxAge: 172800,
            }),
        },
    }
);
