<template>
  <UForm v-if="state" class="w-full flex flex-col gap-2 p-6"  :schema="schema" :state="state" @submit.prevent="submitAction" >
    <UFormGroup name="description" label="Описание">
      <UTextarea v-model="state!.description" placeholder="Описание книги"/>
    </UFormGroup>
    <UFormGroup label="Состояние:" name="condition">
      <USelectMenu
          v-model="state.condition"
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
    <UFormGroup label="Видимость:" name="status">
      <USelectMenu
          v-model="state.status"
          class="flex-1"
          :options="
                                Object.entries(useStatusString).map(
                                    ([key, value], index) => ({
                                        name: key,
                                        title: value,
                                        id: key,
                                    })
                                )
                            "
          placeholder="Выберите видимость книги"
          option-attribute="title"
          by="id"
      />
    </UFormGroup>
    <UButton type="submit" :ui="{width: '100%'}" label="Сохранить"/>
  </UForm>
</template>

<script setup lang="ts">
import {z} from "zod"
import type {BookInstance} from "~/types/book";

const schema = z.object({
  description: z.string().min(1, {message: "Описание не должно быть пустым"}).max(255, {message: "Описание не должно превышать 255 символов в длинну"}),
})

const state = ref<BookInstance>()
const route = useRoute()
const id = route.params.id as string

const {$api} =useNuxtApp()

const fetchData = async ()=>{
  $api<BookInstance>(`/instances/${id}`).then(res=>{
    state.value = res;
  })
}

fetchData()

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Редактирование экземпляра'
})

const submitAction = () =>{
  if(!state.value){
    return;
  }
  const data = JSON.stringify({
    description: state.value.description,
    condition: state.value.condition.name,
    photoId: state.value.photoId,
    locationId: state.value.locationId,
    status: state.value.status.name,
  });
  $api(`/instances/${id}`, {
    method: "PATCH",
    body: data
  }).then(_=>{
    navigateTo(`/admin/instances/${state.value!.bookId}`)
  }).catch(_=>{
    navigateTo(`/admin/instances/${state.value!.bookId}`)
  })
}

</script>

<style scoped>

</style>