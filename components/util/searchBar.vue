<template>
    <UForm class="flex-1" :schema="schema" :state="state" @submit="onSubmit">
        <UInput
            v-model="state.query"
            color="white"
            icon="i-heroicons-magnifying-glass-20-solid"
            variant="outline"
            placeholder="Поиск..."
        />
    </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  query: z.string().min(1, 'Must be at least 1 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  query: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await navigateTo({
    path: '/search',
        query: {
            q: event.data.query
        }
    })
}
</script>