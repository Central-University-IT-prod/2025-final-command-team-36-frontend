<script lang="ts" setup>
import type { Book } from "~/types/book";
import type { Location } from "~/types/location";

const { $api } = useNuxtApp();

definePageMeta({
    title: "Сдача книги",
});

const bookHolder = ref<
    Omit<Book, "editionYear" | "pages"> & { editionYear: string; pages: string }
>({
    id: "",
    name: "",
    author: "",
    isbn: "",
    genre: "",
    editionYear: "",
    publishingCompany: "",
    language: "",
    cover: "",
    pages: "1",
    size: "",
    coverId: "",
});

const bookProps = [
    {
        name: "author",
        title: "Автор",
        id: 0,
    },
    {
        name: "isbn",
        title: "ISBN",
        id: 1,
    },
    {
        name: "genre",
        title: "Жанр",
        id: 2,
    },
    {
        name: "editionYear",
        title: "Год",
        id: 3,
    },
    {
        name: "publishingCompany",
        title: "Издательство",
        id: 4,
    },
    {
        name: "language",
        title: "Язык",
        id: 5,
    },
    {
        name: "pages",
        title: "Количество страниц",
        id: 6,
    },
] as const;
const customBookImageId = ref("");

const bookSizeVariants = [
    {
        name: "SMALL",
        label: "Маленький",
        id: 0,
    },
    {
        name: "MEDIUM",
        label: "Стандартный",
        id: 1,
    },
    {
        name: "LARGE",
        label: "Подарочное издание",
        id: 2,
    },
];
const customBookSize = ref();
const customBookCover = ref();

const selectedBook = ref();
const selectedBookVModel = computed({
    get: () => selectedBook.value,
    set: (val) => {
        selectedBook.value = val
        if (typeof val !== "string" && val.id !== undefined) {
            bookHolder.value = val;
            customBookCover.value = val.cover;
            customBookSize.value = val.size;
        }
    }
})

const isCustomBook = computed(() =>
    selectedBook.value
        ? typeof selectedBook.value === "string" ||
          selectedBook.value?.id === undefined
        : false
);
const selectedBookShow = computed(() =>
    selectedBook.value
        ? typeof selectedBook.value === "string"
            ? selectedBook.value
            : selectedBook.value.name
        : "Книга не выбрана"
);
const selectedLocation = ref();
const selectedState = ref();
const instanceImageId = ref("");
const instanceDescription = ref("");
const loading = ref(false);

async function searchBook(q: string) {
    loading.value = true;

    try {
        const books: Book[] = await $api("/books/search", { query: { query: q } });
        loading.value = false;
        return books;
    } catch (error) {
        loading.value = false;
        return []
    }
}

const { data: locations } = await useApiFetch<Location[]>("/locations");

const toast = useToast();
const lock = ref(false);

const onSubmit = async () => {
    if (lock.value) return;
    lock.value = true;
    let bookId = bookHolder.value.id;
    try {
        if (isCustomBook.value) {
            const response = await $api<Book>("/books", {
                method: "POST",
                body: {
                    name: selectedBookShow.value,
                    author: bookHolder.value.author,
                    isbn: bookHolder.value.isbn,
                    genre: bookHolder.value.genre,
                    editionYear: bookHolder.value.editionYear,
                    publishingCompany: bookHolder.value.publishingCompany,
                    language: bookHolder.value.language,
                    cover: customBookCover.value,
                    pages: bookHolder.value.pages,
                    size: customBookSize.value,
                    coverId: customBookImageId.value,
                },
            });
            bookId = response.id;
        }
        await $api("/instances", {
            method: "POST",
            body: {
                bookId: bookId,
                description: instanceDescription.value,
                condition: selectedState.value.name,
                photoId: instanceImageId.value,
                locationId: selectedLocation.value.id,
            },
        });
        toast.add({
            color: "green",
            title: isCustomBook.value
                ? "Книга и объявление были успешно созданы!"
                : "Объявление было успешно создано!",
            description:
                (isCustomBook.value
                    ? "Они будут опубликованы"
                    : "Оно будет опубликовано") + " сразу после модерации!",
        });
        await navigateTo("/");
    } catch (err) {
        console.error("Error creating instance:", err);
        lock.value = false;
        toast.add({
            color: "red",
            title: "Ошибка",
            description: "Не удалось создать объявление",
        });
    }
};

const validate = (state: any): FormError[] => {
    const errors = [];
    if (instanceImageId.value.length < 1)
        errors.push({
            path: "instanceImageUpload",
            message: "Загрузите изображение",
        });
    if (selectedBookShow.value == "Книга не выбрана")
        errors.push({
            path: "instanceBookName",
            message: "Выберите название книги",
        });
    if (!selectedLocation.value)
        errors.push({
            path: "location",
            message: "Выберите расположение книги",
        });
    if (!selectedState.value)
        errors.push({ path: "condition", message: "Выберите состояние книги" });

    if (isCustomBook.value) {
        if (customBookImageId.value.length < 1)
            errors.push({
                path: "customBookImageUpload",
                message: "Загрузите изображение",
            });
        if (bookHolder.value["author"].length < 3)
            errors.push({
                path: "author",
                message: "Имя автора должно быть не менее 3 символов",
            });
        if (bookHolder.value["isbn"].length != 13)
            errors.push({
                path: "isbn",
                message: "ISBN должен содержать 13 символов",
            });
        if (bookHolder.value["genre"].length < 3)
            errors.push({
                path: "genre",
                message: "Жанр должен содержать не менее 3 символов",
            });
        if (bookHolder.value["editionYear"].length < 4)
            errors.push({
                path: "editionYear",
                message: "Год издания должен содержать 4 символа",
            });
        if (bookHolder.value["publishingCompany"].length < 3)
            errors.push({
                path: "publishingCompany",
                message:
                    "Название издательства должно быть не менее 3 символов",
            });
        if (bookHolder.value["language"].length < 2)
            errors.push({
                path: "language",
                message: "Язык должен содержать не менее 2 символов",
            });
        if (bookHolder.value["pages"] < 1)
            errors.push({
                path: "pages",
                message: "Количество страниц должно быть не менее 1",
            });

        if (!customBookSize.value)
            errors.push({ path: "bookSize", message: "Выберите размер книги" });
        if (!customBookCover.value)
            errors.push({
                path: "bookCover",
                message: "Выберите тип обложки книги",
            });
    }
    return errors;
};
</script>

<template>
    <UForm :state="bookHolder" :validate="validate" @submit="onSubmit">
        <div class="p-4">
            <h3 class="text-2xl font-semibold">Сдайте книгу</h3>
            <p class="my-2">
                Сфотографируйте свой экземпляр книги и укажите информацию о
                состоянии
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
                <UtilImageUpload
                    v-model="instanceImageId"
                    :name="'instanceImageUpload'"
                />
                <div class="w-full flex flex-col gap-2">
                    <ClientOnly>
                        <UFormGroup name="instanceBookName" label="Название:">
                            <USelectMenu
                                v-model="selectedBookVModel"
                                class="flex-1"
                                :loading="loading"
                                :searchable="searchBook"
                                placeholder="Введите название книги..."
                                option-attribute="name"
                                creatable
                                show-create-option-when="always"
                                by="id"
                            >
                                <template #option-create="{ option }">
                                    <span class="flex-shrink-0 opacity-80"
                                        >Создать книгу с названием
                                    </span>
                                    <q class="block truncate">{{ typeof option === "string" ? option : option.name }}</q>
                                </template>
                            </USelectMenu>
                        </UFormGroup>
                        <UFormGroup name="location" label="Расположение:">
                            <USelectMenu
                                v-if="locations"
                                v-model="selectedLocation"
                                class="flex-1"
                                :options="locations"
                                placeholder="Введите название точки..."
                                option-attribute="name"
                                by="id"
                            />
                        </UFormGroup>
                        <UFormGroup name="condition" label="Состояние:">
                            <USelectMenu
                                v-model="selectedState"
                                class="flex-1"
                                :options="
                                    Object.entries(useConditionString).map(
                                        ([key, value], index) => ({
                                            name: key,
                                            title: value,
                                            id: key,
                                        })
                                    )
                                "
                                placeholder="Выберите состояние книги"
                                option-attribute="title"
                                by="id"
                            />
                        </UFormGroup>
                    </ClientOnly>
                    <UFormGroup label="Описание ">
                        <UTextarea
                            v-model="instanceDescription"
                            class="flex-1"
                            placeholder="Пример: Порвана 7 страница"
                        />
                    </UFormGroup>
                </div>
            </div>
        </div>
        <div class="w-full h-[1px] bg-white bg-opacity-20" />
        <div class="p-4">
            <h3 class="text-2xl font-semibold">Добавить книгу</h3>
            <p class="my-2">
                Если мы не знаем о вашей книге, расскажите нам про неё и
                загрузите качественную обложку
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
                <UtilImageUpload
                    v-if="isCustomBook"
                    v-model="customBookImageId"
                    :name="'customBookImageUpload'"
                />
                <UtilAttachment
                    v-else-if="bookHolder.coverId.length > 0"
                    :id="bookHolder.coverId"
                    class="w-full sm:max-w-80 h-fit"
                />
                <div
                    v-else
                    class="w-full h-full sm:max-w-80 aspect-book flex justify-center items-center bg-gray-300 dark:bg-gray-500 bg-opacity-20 dark:bg-opacity-20 rounded-md"
                >
                    <span>Нет изображения</span>
                </div>
                <div class="w-full flex flex-col gap-2">
                    <UFormGroup label="Название:">
                        <UInput
                            v-model="selectedBookShow"
                            class="flex-1"
                            :disabled="true"
                        />
                    </UFormGroup>
                    <UFormGroup
                        v-for="prop in bookProps"
                        :key="prop.id"
                        :label="prop.title"
                        :name="prop.name"
                    >
                        <UInput
                            v-model="bookHolder[prop.name]"
                            class="flex-1"
                            :disabled="!isCustomBook"
                        />
                    </UFormGroup>
                    <ClientOnly>
                        <UFormGroup name="bookSize" label="Размер:">
                            <USelectMenu
                                v-model="customBookSize"
                                class="flex-1"
                                :disabled="!isCustomBook"
                                :options="bookSizeVariants"
                                placeholder="Выберите размер книги"
                                value-attribute="name"
                                option-attribute="label"
                            />
                        </UFormGroup>
                        <UFormGroup name="bookCover" label="Обложка:">
                            <USelectMenu
                                v-model="customBookCover"
                                class="flex-1"
                                :disabled="!isCustomBook"
                                :options="[
                                    {
                                        name: 'HARD',
                                        label: 'Твёрдая',
                                        id: 0,
                                    },
                                    {
                                        name: 'SOFT',
                                        label: 'Мягкая',
                                        id: 1,
                                    },
                                ]"
                                placeholder="Выберите тип обложки"
                                value-attribute="name"
                                option-attribute="label"
                            />
                        </UFormGroup>
                    </ClientOnly>
                </div>
            </div>
        </div>
        <div class="w-full h-[1px] bg-white bg-opacity-20" />
        <div class="p-4">
            <UButton block type="submit">Опубликовать</UButton>
        </div>
    </UForm>
</template>
