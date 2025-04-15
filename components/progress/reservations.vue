<script lang="ts" setup>
import { useReservationsStore } from "~/store/reservations";

const { reservations } = toRefs(useReservationsStore());
</script>

<template>
    <UProgress
        indicator
        :value="reservations.length"
        :max="useReservationLimit"
    >
        <template #indicator>
            <p class="opacity-50">
                {{ reservations.length }}/{{ useReservationLimit }}
            </p>
        </template>
    </UProgress>
</template>

<style lang="scss" scoped></style>
