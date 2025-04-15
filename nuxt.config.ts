// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },

    modules: [
        "@pinia/nuxt",
        "@nuxt/eslint",
        "pinia-plugin-persistedstate/nuxt",
        "@nuxt/ui",
        "@vueuse/nuxt",
        "@nuxt/fonts",
    ],
    icon: {
        provider: "iconify",
        serverBundle: false,
    },

    app: {
        pageTransition: {
            name: "page",
            mode: "out-in",
        },
        layoutTransition: {
            name: "page",
            mode: "out-in",
        },
    },

    ssr: false,

    css: ["@/assets/css/global.scss"],

    tailwindcss: {
        config: {
            theme: {
                extend: {
                    gridTemplateColumns: {
                        elementCard: "repeat(auto-fill, minmax(144px, 1fr))",
                    },
                    aspectRatio: {
                        book: "3 / 4",
                    },
                },
            },
        },
    },

    routeRules: {
        "/api/**": {
            proxy: "https://prod-team-36-m2st0u6v.REDACTED/api/**",
        },
    },

    runtimeConfig: {
        public: {
            baseURL: "https://prod-team-36-m2st0u6v.REDACTED/api",
        },
    },
});
