import { useAuthCacheStore } from "~/store/auth";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const $api = $fetch.create({
        baseURL: config.public.baseURL,
        headers: useRequestHeaders(["SESSION"]),
        credentials: "include",
        onResponseError({ response }) {
            if (response.status === 401) {
                const auth = useAuthCacheStore();
                auth.user = null;
            }
        },
    });
    return {
        provide: {
            api: $api,
        },
    };
});
