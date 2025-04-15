<template>
    <UDropdown :ui="{ width: 'w-fit min-w-48' }" :items="items">
        <UAvatar :alt="user?.name" :icon="iconC" size="md" />

        <template #account="{ item }">
            <div class="text-left">
                <p>Выполнен вход в</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ item.label }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
            <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>

            <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            />
        </template>

        <template #click="{ item }">
            <div class="group flex items-center gap-1.5 w-full text-sm rounded-md text-gray-700 dark:text-gray-200" @click="item.fn">
                <span>{{ item.label }}</span>
    
                <UIcon
                    :name="item.icon"
                    class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
                />
            </div>
        </template>
    </UDropdown>
</template>

<script lang="ts" setup>
import { useAuthCacheStore } from "~/store/auth";

const store = useAuthCacheStore();
const { user, isAuthenticated } = storeToRefs(store);

const { $api } = useNuxtApp();

const iconC = computed(() =>
    isAuthenticated.value ? null : "carbon:user-avatar-filled-alt"
);
const items = computed(() =>
    isAuthenticated.value
        ? user.value?.role == "ADMIN"
            ? [
                  [
                      {
                          label: user.value?.name,
                          slot: "account",
                          disabled: true,
                      },
                  ],
                  [
                      {
                          label: "Личный кабинет",
                          to: "/me",
                          icon: "heroicons:adjustments-vertical-16-solid",
                      },
                  ],
                  [
                      {
                          label: "Панель администратора",
                          to: "/admin/users",
                          icon: "material-symbols:admin-panel-settings",
                      },
                  ],
                  [
                      {
                          label: "Выйти из аккаунта",
                          slot: "click",
                          fn: async () => {
                              await $api("/auth/log-out", { method: "POST" }).then(
                                  () => {
                                      store.user = null;
                                  }
                              ).finally(() => navigateTo('/'));
                          },
                          icon: "i-heroicons-arrow-left-on-rectangle",
                      },
                  ],
              ]
            : [
                  [
                      {
                          label: user.value?.email,
                          slot: "account",
                          disabled: true,
                      },
                  ],
                  [
                      {
                          label: "Личный кабинет",
                          to: "/me",
                          icon: "heroicons:adjustments-vertical-16-solid",
                      },
                  ],
                  [
                      {
                          label: "Выйти из аккаунта",
                          slot: "click",
                          fn: async () => {
                            await $api("/auth/log-out", { method: "POST" }).then(
                                  () => {
                                      store.user = null;
                                  }
                              ).finally(() => navigateTo('/'));
                          },
                          icon: "i-heroicons-arrow-left-on-rectangle",
                      },
                  ],
              ]
        : [
              [
                  {
                      label: "Войти",
                      to: "/auth/login",
                      icon: "material-symbols:login",
                  },
              ],
          ]
);
</script>
