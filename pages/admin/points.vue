<template>
    <div class="flex flex-col gap-2 w-full p-6">
        <UModal v-model="deleteModal">
            <UCard>
                <template #header>
                    <h1 class="text-2xl">
                        Удаление '<b>{{ modalItem!.name }}</b
                        >'
                    </h1>
                </template>

                <p class="text-lg">
                    Вы действительно хотите удалить данный шкаф? Это действие
                    отменить не получится.
                </p>

                <template #footer>
                    <div class="w-full flex justify-between">
                        <UButton
                            label="Отменить"
                            @click="deleteModal = false"
                        />
                        <UButton
                            label="Удалить"
                            color="red"
                            @click="deleteAction"
                        />
                    </div>
                </template>
            </UCard>
        </UModal>
        <div class="flex justify-between">
            <h1 class="text-2xl">Шкафы</h1>
            <UButton
                label="Новый шкаф"
                @click="navigateTo('/admin/edit/new/point')"
            />
        </div>
        <ProgressLoading :loading="!loaded" :empty="locations.length === 0" />
        <div class="flex flex-col gap-2 w-full">
            <AdminElementCard
                v-for="item in locations"
                :key="item.id"
                @delete="openDeleteModal(item)"
                @edit="handleEdit(item.id)"
            >
                <div class="flex flex-col gap-2">
                    <h3 class="text-xl">{{ item.name }}</h3>
                    <div class="flex max-sm:flex-col gap-2">
                        <UBadge
                            class="w-fit"
                            icon="i-heroicons-map-pin"
                            size="sm"
                            :label="item.address"
                        />
                        <UBadge
                            class="w-fit"
                            size="sm"
                            :label="`Максимум книг: ${item.limit}`"
                        />
                    </div>
                </div>
            </AdminElementCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Location } from "~/types/location";

definePageMeta({
    layout: "admin",
    middleware: "admin",
});

useHead({
  title: 'Админ-панель: Шкафы'
})

const { $api } = useNuxtApp();
const locations = ref<Location[]>([]);

const loaded = ref<boolean>(false);

const deleteModal = ref<boolean>(false);
const modalItem = ref<Location>();

const updateLocations = async () => {
    loaded.value = false;
    $api<Location[]>("/locations")
        .then((res) => {
            locations.value = res;
            loaded.value = true;
        })
        .catch((_) => {
          loaded.value = true;
        });
};

const openDeleteModal = (item: Location) => {
    modalItem.value = item;
    deleteModal.value = true;
};

updateLocations();

const deleteAction = async () => {
    deleteModal.value = false;
    if (!modalItem.value) {
        return;
    }
    await $api(`/locations/${modalItem.value.id}`, {
        method: "DELETE",
    });
    updateLocations();
};

const handleEdit = (id: string) => {
    navigateTo(`/admin/edit/location/${id}`);
};
</script>

<style></style>
