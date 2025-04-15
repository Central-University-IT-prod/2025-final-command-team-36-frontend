<template>
  <UCard>
    <div class="flex max-sm:flex-col gap-2">
      <div class="w-full">
        <slot/>
      </div>
      <UButtonGroup class="ml-auto min-w-fit max-sm:w-full" orientation="vertical">
        <UButton :label="editLabel" @click="$emit('edit')"/>
        <UButton color="red" :label="deleteLabel" @click="$emit('delete')"/>
      </UButtonGroup>
    </div>
  </UCard>
</template>

<script lang="ts" setup>

defineEmits(['edit', 'delete'])

defineProps({
  editLabel: {
    type: String,
    default: "Изменить"
  },
  deleteLabel: {
    type: String,
    default: "Удалить"
  }
})

</script>

<style>

</style>