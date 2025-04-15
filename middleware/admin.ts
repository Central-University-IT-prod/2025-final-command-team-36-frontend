import { useAuthCacheStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthCacheStore();

    if (!auth.isAuthenticated || auth?.user?.role !== "ADMIN") {
        return navigateTo("/auth/login");
    }
});
