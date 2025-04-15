<template>
  <div class="p-6 h-full">
    <UVerticalNavigation :links="links"/>
  </div>
</template>

<script lang="ts" setup>
  const links = [{
    to: '/admin/users',
    label: 'Пользователи'
  },{
    to: '/admin/points',
    label: 'Шкафы'
  },{
    to: '/admin/books',
    label: 'Книги'
  },{
    to: '/admin/moderation/book',
    label: 'Модерация Книг'
  },{
    to: '/admin/moderation/instances',
    label: 'Модерация Экземпляров'
  },{
    to: '/admin/moderation/report',
    label: "Жалобы"
  }]
</script>

<style>

</style>