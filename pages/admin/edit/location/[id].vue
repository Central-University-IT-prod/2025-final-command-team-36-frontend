<template>
    <UForm
        v-if="location"
        class="mx-auto w-full md:w-1/2 p-6 gap-2 flex flex-col"
        :schema="schema"
        :state="location"
        @submit.prevent="submitAction"
    >
        <UFormGroup name="name" label="Имя шкафа">
            <UInput
                v-model="location!.name"
                name="name"
                placeholder="Например, публичный шкаф"
            />
        </UFormGroup>
        <UFormGroup name="extra" label="Дополнительная инфромация">
            <UInput
                v-model="location!.extra"
                name="extra"
                placeholder="Например, особенности подхода к шкафу"
            />
        </UFormGroup>
        <UFormGroup name="limit" label="Ограничение книг">
            <UInput
                v-model="location!.limit"
                name="limit"
                type="number"
                placeholder="0"
            />
        </UFormGroup>

        <UButton type="submit" label="Сохранить" />
    </UForm>
</template>

<script lang="ts" setup>
import type { Location } from "~/types/location";
import { z } from "zod";

const { $api } = useNuxtApp();

definePageMeta({
    layout: "admin",
    middleware: "admin",
});

useHead({
  title: 'Изменение шкафа'
})

const route = useRoute();

const id = route.params.id as string;

const location = ref<Location>();

const schema = z.object({
    name: z.string().max(255, "Слишком длинное название"),
    extra: z.string().max(255, "Слишком длинное описание"),
    limit: z
        .number()
        .min(1, "Слишком маленькое количество допустимых книг на полке")
        .int("Число дожно быть целым"),
});

const getData = async () => {
    location.value = await $api(`/locations/${id}`);
};

if (id) {
    getData();
}

const submitAction = async () => {
    if (location.value) {
        const response = await $api<Location>(
            `/locations/${location.value.id}`,
            {
                method: "PATCH",
                body: {
                    extra: location.value.extra,
                    name: location.value.name,
                    limit: location.value.limit,
                },
            }
        );
        if (response) {
            location.value = response;
        }
    }
    navigateTo("/admin/points");
};
</script>

<style></style>
