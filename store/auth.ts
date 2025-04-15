import { defineStore } from "pinia";
import type { User } from "~/types/user";

export const useAuthCacheStore = defineStore(
    "auth",
    () => {
        const sessionToken = useCookie("SESSION");
        const user = ref<User | null>(null);
        const { $api } = useNuxtApp();

        callOnce(async () => {
            if (sessionToken.value) {
                try {
                    const userData = await $api<User>("/users/me", {
                        credentials: "include",
                    });
                    user.value = userData ?? null;
                } catch {
                    user.value = null;
                }
            } else {
                user.value = null
            }
        });

        const isAuthenticated = computed(() => !!user.value);

        return {
            user,
            isAuthenticated,
        };
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
