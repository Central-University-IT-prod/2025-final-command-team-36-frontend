export default defineNuxtRouteMiddleware(async (to) => {
    const { $api } = useNuxtApp();

    const instanceId = to.params.instance;

    if (Array.isArray(instanceId)) {
        abortNavigation({
            statusCode: 400,
        });
    }
    const instance = await $api(`/instances/${instanceId}`);

    if (!instance) {
        abortNavigation({
            statusCode: 404,
        });
    }

    to.meta.instance = instance;
});
