<template>
  <div class="flex flex-col gap-2 w-full p-6">
    <h1 class="text-2xl">Модерация</h1>
    <ProgressLoading :loading="!(loaded)" :empty="moderateBooks.length===0"/>
    <div class="flex flex-col gap-2">
      <AdminElementCard v-for="item in moderateBooks" :key="item.id" edit-label="Подтвердить" delete-label="Отклонить" @delete="rejectInstance(item)" @edit="approveInstance(item)">
        <div class="flex max-sm:flex-col gap-2">
        <UtilAttachment :id="item.photoId" class="max-sm:w-full sm:w-1/2 md:w-1/3"/>

        <div class="flex flex-col gap-2">
          <div class="flex gap-2">
            <h3 class="text-xl break-all">{{ item.description }}</h3>
          </div>
          <div class="flex flex-col gap-2">
            <UBadge class="w-fit" icon="i-heroicons-user" size="sm" :label="item.owner.name"/>
            <USelectMenu
                v-model="item.condition"
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
          </div>
        </div>
        </div>
      </AdminElementCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookInstance} from "~/types/book";

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: "Модерация экземпляров"
})

const loaded = ref<boolean>(false);

const moderateBooks = ref<BookInstance[]>([])

const {$api} = useNuxtApp()

const fetchBooks = async () => {
  loaded.value = false;
  $api<BookInstance[]>('/instances/moderation-list').then((res) => {
    moderateBooks.value = res
    loaded.value = true;
  }).catch(_=>{
    loaded.value = true;
  })
}

fetchBooks()

const approveInstance = async (book: BookInstance ) => {
  await $api(`/instances/${book.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      description: book.description,
      condition: book.condition.name,
      photoId: book.photoId,
      locationId: book.locationId,
      status: book.status,
    })
  }).catch((_)=>{

  })
  $api(`/instances/${book.id}/approve`, {method: "POST"}).then((_)=>{fetchBooks()})
}

const rejectInstance = (book: BookInstance) => {
  $api(`/instances/${book.id}/reject`, {method: "POST"}).then((_)=>{fetchBooks()})
}
</script>


<style scoped>

</style>