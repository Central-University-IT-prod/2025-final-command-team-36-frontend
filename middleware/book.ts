export default defineNuxtRouteMiddleware(async (to) => {
    const { $api } = useNuxtApp();

    const bookId = to.params.id;

    if (Array.isArray(bookId)) {
        abortNavigation({
            statusCode: 400,
        });
    }
    const book = await $api(`/books/${bookId}`);

    if (!book) {
        abortNavigation({
            statusCode: 404,
        });
    }

    to.meta.book = book;
});
