import { useAuthCacheStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthCacheStore();

    if (!auth.isAuthenticated) return navigateTo("/auth/login");
});
