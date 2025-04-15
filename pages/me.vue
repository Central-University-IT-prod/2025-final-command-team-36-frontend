<script lang="ts" setup>
import { useAuthCacheStore } from "~/store/auth";
import { ModalUserPasswordChange } from "#components";
import { useReservationsStore } from "~/store/reservations";
import { useFavoritesStore } from "~/store/favorites";

definePageMeta({
    name: "Личный кабинет",
    middleware: "auth"
});

const { user } = storeToRefs(useAuthCacheStore())

const reservationsStore = useReservationsStore()
const { reservations } = storeToRefs(reservationsStore)

const favoritesStore = useFavoritesStore()
const { favorites } = storeToRefs(favoritesStore)

const modal = useModal()
const openPasswordChange = () => {
    modal.open(ModalUserPasswordChange)
}
</script>

<template>
    <div v-if="user" class="p-4 mx-auto max-w-[1000px] space-y-2">
        <UDivider :label="useRolesString[user.role]" />
        <div class="flex flex-col gap-4 sm:flex-row justify-between">
            <div class="space-y-2">
                <h1 class="text-2xl font-bold">{{ user.name }}</h1>
                <p class="opacity-50">{{ user.email }}</p>
            </div>
            <UButton class="h-fit" @click="openPasswordChange">Изменить пароль</UButton>
        </div>
        <UDivider label="Избранные книги" />

        <UCarousel
            v-if="favorites && favorites.length > 0"
            v-slot="{ item: element }"
            :items="favorites"
        >
            <AppElement class="mx-2" :key="element.id" v-bind="element" />
        </UCarousel>

        <div v-else class="text-center py-4">
            <UIcon name="emojione:eyes" />
            <p class="text-xl">У вас нет избранных книг...</p>
        </div>

        <UDivider label="Забронированные книги" />
        <UCarousel
            v-if="reservations && reservations.length > 0"
            v-slot="{ item: element }"
            :items="reservations"
        >
            <AppInstance :key="element.id" class="px-2" :expire-at="element.expireAt" :reservation-id="element.id" :instance="element.instance"/>
        </UCarousel>

        <div v-else class="text-center py-4">
            <UIcon name="emojione:eyes" />
            <p class="text-xl">У вас нет забронированных книг...</p>
        </div>

    </div>
</template>
