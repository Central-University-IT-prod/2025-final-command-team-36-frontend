import type { UseFetchOptions } from "nuxt/app";

export function useApiFetch<T>(
    url: string | (() => string),
    options: UseFetchOptions<T> = {}
) {
    return useFetch(url, {
        ...options,
        $fetch: useNuxtApp().$api,
    });
}

export function useAuthFetch<T>(
    url: string | (() => string),
    options: UseFetchOptions<T> = {}
) {
    return useFetch(url, {
        ...options,
        $fetch: useNuxtApp().$api,
    });
}

// Если кто-то может её нормально написать, сделайте это 🙏
// export function useApiAsyncData<T>(
//     key: string,
//     url: string | (() => string),
//     options: any = {},
//     asyncDataOptions: AsyncDataOptions<T> = {}
//   ) {
//     const getUrl = typeof url === "string" ? () => url : url;
//     const fetchData: Promise<T> = async (ctx?: NuxtApp): Promise<unknown> => {
//         const nuxtApp = ctx ?? useNuxtApp(); // Use provided context or get from composable
//         return nuxtApp.$api(getUrl(), options);
//     };

//     return useAsyncData(key, fetchData, asyncDataOptions)
//   }
// export function useApiAsyncData<T>(
//     key: string,
//     handler: () => Promise<T>,
//     options: AsyncDataOptions<T> = {}
//   ) {
//     return useAsyncData(key, handler, {
//       ...options,
//       server: options.server ?? true, // Ensuring it works both on server and client
//       default: options.default ?? (() => null),
//     });
//   }
