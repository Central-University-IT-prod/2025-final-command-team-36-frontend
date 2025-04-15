<script lang="ts" setup>

const props = defineProps({
  delay: {
    type: String,
    default: '0ms'
  }
})

</script>

<template>

  <Transition
:style="{
    transitionDelay: delay
  }" appear name="item-transition">
    <slot/>
  </Transition>

</template>

<style scoped>

.item-transition-enter-active, .item-transition-leave-active {
  transition: 500ms;
}

.item-transition-enter-from {
  opacity: 0;
  margin: calc(0vh);
  max-height: calc(0vh);
  padding-top: calc(0vh);
  padding-bottom: calc(0vh);
}

.item-transition-enter-to, .item-transition-leave-from {
  pointer-events: none;
  opacity: 100%;
  max-height: calc(10vh);
}

.item-transition-leave-to {
  pointer-events: none;
  opacity: 0;
  filter: blur(2rem);
  margin: calc(0vh);
  max-height: calc(0vh);
  padding-top: calc(0vh);
  padding-bottom: calc(0vh);
}
</style>