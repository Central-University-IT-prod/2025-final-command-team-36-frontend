<template>
    <UForm
        class="m-auto flex flex-col max-sm:w-full sm:w-fit max-w-full gap-2 sm:min-w-96 p-2 my-8"
        :schema="schema"
        :state="state"
        @submit="submitAction"
    >
        <h1 class="mx-auto font-bold text-xl">Авторизация</h1>
        <UFormGroup label="Электронная почта" name="email">
            <UInput
                v-model="state.email"
                placeholder="Например, example@example.com"
            />
        </UFormGroup>
        <UFormGroup class="w-full flex flex-col" label="Пароль" name="password">
            <UInput
                v-model="state.password"
                type="password"
                placeholder="Введите пароль"
            />
        </UFormGroup>

        <UButton type="submit" :ui="{ width: '100%' }" label="Войти" />
        <div class="flex justify-between">
            <h2 class="text-secondary">Нет аккаунта?</h2>
            <ULink to="/auth/register" class="text-primary">Регистрация</ULink>
        </div>
    </UForm>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { User } from "~/types/user";
import { useAuthCacheStore } from "~/store/auth";

definePageMeta({
    title: "Вход в аккаунт"
})

const toast = useToast();

const schema = z.object({
    email: z.string().email("Неверный формат почты"),
    password: z
        .string()
        .min(8, { message: "Пароль должен быть длиной минимум в 8 символов" }),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
    email: "",
    password: "",
});

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

const store = useAuthCacheStore();

const submitAction = async (event: FormSubmitEvent<Schema>) => {
    event.preventDefault();
    $api<User>("/auth/sign-in", {
        method: "POST",
        body: {
            email: state.value.email,
            password: state.value.password,
        },
        credentials: "include",
    })
        .then((res) => {
            store.user = res;
            router.push((route.query.redirect as string) ?? "/");
        })
        .catch((err) => {
            if (err.statusCode === 401) {
                toast.add({
                    color: "rose",
                    title: "Ошибка авторизации",
                    description: "Неверный логин или пароль",
                });
            }
        });
};
</script>

<style></style>
