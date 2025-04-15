<template>
    <NuxtLink :to="`/book/${instance.bookId}/${instance.id}`" class="flex flex-col w-40 h-full">
        <div class="flex-1">
            <div class="flex justify-center pb-1">
                <UtilAttachment :id="instance.photoId" class="w-5/6" />
            </div>
            <div v-if="expireAt" class="flex justify-center my-1">
                <UBadge color="gray">
                    Бронь до {{ new Date(expireAt).toLocaleDateString() }}
                </UBadge>
            </div>
            <p class="text-center font-semibold text-sm">
                {{ instance.location.name }}
            </p>
        </div>
        <p class="text-center text-sm text-gray-500">
            {{ instance.location.address }}
        </p>
        <UDivider class="my-1" />
        <p class="text-center text-xs text-gray-500">
            {{ instance.owner.name }}
        </p>
    </NuxtLink>
</template>

<script setup lang="ts">
import { useReservationsStore } from "~/store/reservations";
import type { BookInstance } from "~/types/book";

const reservationStore = useReservationsStore()

defineProps<{
    instance: BookInstance,
    expireAt?: string,
    reservationId?: string
}>();
</script>
