<template>
    <UForm @submit.prevent="submitAction">
        <UFormGroup>
            <UTextarea />
        </UFormGroup>
    </UForm>
</template>

<script lang="ts" setup>
import type { Book } from "~/types/book";

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Редактирование книги'
})

const route = useRoute();

const id = route.params.id;

const book = ref<Book>();

const { $api } = useNuxtApp();

if (id) {
    $api<Book>("/books/" + id).then((res) => {
        book.value = res;
    });
}

const submitAction = () => {};
</script>

<style></style>
