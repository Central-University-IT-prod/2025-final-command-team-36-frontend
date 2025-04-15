<template>
  <div class="flex flex-col gap-2 w-full p-6">
    <h1 class="text-2xl">Модерация</h1>
    <ProgressLoading :loading="!(loaded)" :empty="moderateBooks.length===0"/>
    <div class="flex flex-col gap-2">
      <AdminElementCard v-for="item in moderateBooks" edit-label="Подтвердить" delete-label="Отклонить" :key="item.id" @delete="rejectBook(item)" @edit="approveBook(item)">
        <div class="flex max-sm:flex-col gap-2">
          <UtilAttachment :id="item.coverId" class="max-sm:max-w-full max-sm:min-w-full sm:max-w-1/2 sm:min-w-1/2 md:max-w-1/3 md:min-w-1/3"/>

          <div class="flex flex-col gap-2">
            <div class="flex max-sm:flex-col gap-2">
              <h3 class="text-xl break-all">{{ item.name }}</h3>
            </div>
            <div class="">
              <UBadge class="w-fit ml-2 mt-2" icon="i-heroicons-book-open" size="sm" :label="item.genre"/>
              <UBadge class="w-fit ml-2 mt-2" icon="i-heroicons-academic-cap" size="sm" :label="item.author"/>
            </div>
          </div>
        </div>
      </AdminElementCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Book} from "~/types/book";

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Модерация книг'
})

const loaded = ref<boolean>(false);

const moderateBooks = ref<Book[]>([])

const {$api} = useNuxtApp()

const fetchBooks = async () => {
  loaded.value = false;
  $api<Book[]>('/books/moderation-list').then((res) => {
    moderateBooks.value = res
    loaded.value = true;
  }).catch(_=>{
    loaded.value = true;
  })
}

fetchBooks()

const approveBook = (book: Book) => {
  $api(`/books/${book.id}/approve`, {method:"POST"}).then((_)=>{fetchBooks()})
}

const rejectBook = (book: Book) => {
  $api(`/books/${book.id}/reject`, {method:"POST"}).then((_)=>{fetchBooks()})
}

</script>

<style scoped>

</style>