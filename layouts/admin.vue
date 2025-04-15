<template>
  <div class="flex flex-col min-h-full">
    <LayoutHeader class="px-4" />
    <AdminNavigation class="sm:hidden"/>

    <div class="w-full flex min-h-full">
      <AdminNavigation class="max-sm:hidden"/>
      <slot/>
    </div>
    <LayoutFooter class="px-4 mt-auto" />
  </div>
</template>
<script setup lang="ts">
</script>