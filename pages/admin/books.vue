<template>
  <div class="flex flex-col gap-2 w-full p-6">
    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <h1 class="text-2xl">
            Удаление '<b>{{ modalItem!.name }}</b
          >'
          </h1>
        </template>

        <p class="text-lg">
          Вы действительно хотите удалить данную книгу? Это действие
          отменить не получится.
        </p>

        <template #footer>
          <div class="w-full flex justify-between">
            <UButton
                label="Отменить"
                @click="deleteModal = false"
            />
            <UButton
                label="Удалить"
                color="red"
                @click="deleteAction"
            />
          </div>
        </template>
      </UCard>
    </UModal>
    <h1 class="text-2xl">Книги</h1>
    <ProgressLoading :loading="!loaded" :empty="books.length===0"/>
    <div class="flex flex-col gap-2 w-full">
      <AdminElementCard v-for="item in books" edit-label="Экземпляры" :key="item.id" @delete="handleDelete(item)" @edit="handleEdit(item.id)">
        <div class="flex flex-col gap-2">
          <div class="flex max-sm:flex-col gap-2">
            <UAvatar :src="`/api/attachments/${item.coverId}/content`" :alt="item.name" />
            <h3 class="text-xl">{{ item.name }}</h3>              
          </div>
          <div class="space-x-2 space-y-2 gap-2">
            <UBadge class="w-fit" icon="i-heroicons-book-open" size="sm" :label="item.genre"/>
            <UBadge class="w-fit" icon="i-heroicons-academic-cap" size="sm" :label="item.author"/>
            <UBadge class="w-fit" icon="i-heroicons-calendar" size="sm" :label="item.editionYear"/>
            <UBadge class="w-fit" icon="i-heroicons-document" size="sm" :label="item.publishingCompany"/>
            <UBadge class="w-fit" icon="i-heroicons-language" size="sm" :label="item.language"/>
            <UBadge class="w-fit" icon="i-heroicons-document-duplicate" size="sm" :label="item.pages"/>
          </div>
        </div>
      </AdminElementCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Book } from '~/types/book'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Админ-панель: Книги'
})

const {$api} = useNuxtApp()

const books = ref<Book[]>([])
const loaded = ref<boolean>(false)

const deleteModal = ref<boolean>(false);
const modalItem = ref<Book>();

const updateBooks = async () =>{
  loaded.value = false

    $api<Book[]>('/books').then((res)=>{
      books.value = res;
      loaded.value = true
    }).catch(_=>{
      loaded.value = true;
    })
}
updateBooks()

const handleDelete = (item: Book) => {
  modalItem.value = item
  deleteModal.value = true
}

const deleteAction = () => {
  deleteModal.value = false;
  if(modalItem.value){
    $api(`/books/${modalItem.value.id}`, {method: 'DELETE'}).then((_) => {
      updateBooks()
    }).catch((_)=>{
      updateBooks()
    })
  }
}

const handleEdit = (id: string)=>{
  navigateTo(`/admin/instances/${id}`)
}

</script>

<style>

</style>