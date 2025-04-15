<template>
  <div v-if="loading || empty">
    <UCard v-if="loading">
      <h2 class="text-xl">Загрузка....</h2>
      <UProgress class="mt-2" animation="carousel"/>
    </UCard>
    <UCard v-else>
      <h2 class="text-xl">Кажется, тут пусто</h2>
    </UCard>
  </div>
</template>

<script lang="ts" setup>

defineProps({
  empty: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: true
  }
})

</script>

<style>

</style>