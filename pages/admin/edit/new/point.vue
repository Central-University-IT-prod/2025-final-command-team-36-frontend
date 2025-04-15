<template>
  <UForm :schema="schema" :state="data" class="p-6 flex flex-col gap-2 w-full" @submit.prevent="submitAction">
    
    <UFormGroup name="name" label="Имя шкафа">
      <UInput v-model="data!.name" name="name" placeholder="Например, публичный шкаф"/>
    </UFormGroup>
    <UFormGroup name="address" label="Адрес шкафа">
      <UInput v-model="data!.address" name="address" placeholder="Например, улица Пушкина, д. 7"/>
    </UFormGroup>
    <UFormGroup name="extra" label="Дополнительная инфромация">
      <UInput v-model="data!.extra" name="extra" placeholder="Например, особенности подхода к шкафу"/>
    </UFormGroup>
    <UFormGroup name="limit" label="Ограничение книг">
      <UInput v-model="data!.limit" name="limit" type="number" placeholder="0"/>
    </UFormGroup>
    
    <UButton type="submit" label="Сохранить"/>

  </UForm>
</template>

<script lang="ts" setup>
  import {z} from 'zod'
  const {$api} = useNuxtApp()

  definePageMeta({
    layout: 'admin',
    middleware: 'admin',
  })

  useHead({
    title: 'Создание нового шкафа'
  })

  const schema = z.object({
    address: z.string().max(255, {message: 'Адрес слишком длинный'}),
    extra: z.string().max(255, {message: 'Слишком длинные дополнительные данные'}),
    name: z.string().max(255, {message: 'Слишком длинное название'}),
    limit: z.number().min(1, {message: "Ограничение должно быть натуральным чилом"}).int('Число должно быть целым')
  })

  type Schema = z.output<typeof schema>;
  const data = ref<Schema>({
    name: '',
    address:'',
    extra:'',
    limit: 0
  });

const submitAction = ()=>{
  $api('/locations', {
    method: 'POST',
    body: data.value
  })
  navigateTo('/admin/points')
}

</script>

<style>

</style>