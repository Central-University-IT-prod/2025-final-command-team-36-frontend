<template>
  <div class="flex flex-col gap-2 w-full p-6">
    <UModal v-model="editModal">
      <UCard>
        <UForm :schema="schema" :state="modalName" class="flex flex-col gap-2" @submit.prevent="submitAction">
          <UFormGroup name="name" label="ФИО">
            <UInput
                v-model="modalName.name"
                placeholder="Кабарухин Евгений Деплоевич"
            />
          </UFormGroup>
          <UButton type="submit" :ui="{width: '100%'}" label="Сохранить"/>
        </UForm>
      </UCard>
    </UModal>
    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <h1 class="text-2xl">
            Удаление '<b>{{ modalItem!.name }}</b
          >'
          </h1>
        </template>

        <p class="text-lg">
          Вы действительно хотите удалить данного пользователя? Это действие
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
    <h1 class="text-2xl">Пользователи</h1>
    <ProgressLoading :loading="!loaded" :empty="users.length===0"/>
    <div class="flex flex-col gap-2 w-full">
      <AdminElementCard v-for="item in users" :key="item.id" @delete="handleDeletion(item)" @edit="handleEdit(item)">
        <div class="flex flex-col gap-2">
          <h3 class="text-xl">{{ item.name }}</h3>
          <h3 class="text-sm text-black/40 dark:text-white/40">{{item.email}}</h3>
        </div>
      </AdminElementCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '~/types/user'
import {z} from "zod"

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: 'Админ-панель: Пользователи'
})

const {$api} = useNuxtApp()

const users = ref<User[]>([])
const loaded = ref<boolean>(false);
const fetchUsers = async() => {
  loaded.value = false;
  $api<User[]>('/users').then((res) => {
    users.value = res;
    loaded.value = true;
  }).catch((_)=>{
    loaded.value = true;
  })
}

fetchUsers()

const schema = z.object({
  name: z
      .string()
      .min(1, { message: "Имя должно быть длиной минимум в 1 символа" })
      .max(255, {
        message: "Имя должно быть длиной максимум в 255 символов",
      })
})



const modalName = ref<{ name: string }>({name: ''})
const modalItem = ref<User>();
const deleteModal = ref<boolean>(false);
const editModal = ref<boolean>(false);

const handleDeletion = (item: User)=>{
  modalItem.value = item;
  deleteModal.value = true;
}

const deleteAction = async () => {
  deleteModal.value = false;
  if (modalItem.value)
    $api(`/users/${modalItem.value.id}`, {method: "DELETE"}).catch((_)=>{

    }).then((_)=>{
      fetchUsers()
    })
}

const handleEdit = (item: User)=>{
  modalName.value = {name: item.name};
  modalItem.value = item;
  editModal.value = true;
}

const submitAction = async () => {
  editModal.value = false
  if (modalItem.value){
    $api(`/users/${modalItem.value.id}`, {method: "PATCH", body:{name: modalName.value.name}}).catch((_)=>{}).then((_)=>{
      fetchUsers()
    })
  }
}

</script>

<style>

</style>