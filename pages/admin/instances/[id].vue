<template>
  <div class="flex flex-col gap-2 w-full p-6">
    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <h1 class="text-2xl">
            Удаление экземпляра '<b>{{ book!.name }}</b>'
          </h1>
        </template>

        <p class="text-lg">
          Вы действительно хотите удалить данный экземпляр? Это действие
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
    <div class="flex gap-2 justify-between">
      <h1>Экземпляры книги '<b>{{bookName}}</b>'</h1>
<!--      <UButton label="Изменить книгу" :to="`/admin/edit/book/${id}`"/>-->
    </div>

    <div class="flex flex-col gap-2 w-full">
      <ProgressLoading :loading="!loaded" :empty="books.length===0"/>
      <AdminElementCard v-for="item in books" :key="item.id" @delete="handleDeletion(item)" @edit="handleEdit(item.id)">
        <div class="flex gap-2">
          <UtilAttachment :id="item.photoId" class="w-1/3"/>
          <div class="flex flex-col gap-2">
            <div class="flex max-sm:flex-col gap-2">
              <h3 class="text-xl">{{ bookName }}</h3>
            </div>
            <div class="flex max-sm:flex-col gap-2">
              <UBadge class="w-fit" icon="i-heroicons-book-open" size="sm" :label="book!.genre"/>
              <UBadge class="w-fit" icon="i-heroicons-academic-cap" size="sm" :label="book!.author"/>
            </div>
          </div>
        </div>
      </AdminElementCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Book, BookInstance } from '~/types/book'

const {$api} = useNuxtApp()

const books = ref<BookInstance[]>([])
const book = ref<Book>()
const loaded = ref<boolean>(false)

const bookName = computed(()=>{
  if(!book.value){
    return ""
  }
  return book.value.name;
})

const route = useRoute()
const id = route.params.id;

const updateBooks = async () =>{
  loaded.value = false;
  book.value = await $api<Book>(`/books/${id}`)

  $api<BookInstance[]>(`/instances/book/${id}`).then(async (res)=>{
    books.value = res;
    loaded.value = true;
  }).catch(_=>{
    loaded.value = true;
  })
}
updateBooks()

const modalItem = ref<BookInstance>()

const handleDeletion = (item: BookInstance)=>{
  modalItem.value = item
  deleteModal.value = true
}

const handleEdit = (id: string)=>{
  navigateTo(`/admin/edit/instance/${id}`)
}

const deleteModal = ref<boolean>()

const deleteAction = () => {
  deleteModal.value = false
  if(modalItem.value){
    $api(`/instances/${modalItem.value.id}`, {method: 'DELETE'}).then((_)=>{
      updateBooks()
    }).catch((_)=>{updateBooks()})
  }
}

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: `Экземпляры ${bookName.value}`
})

</script>

<style>

</style>