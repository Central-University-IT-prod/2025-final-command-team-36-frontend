<template>
    <UForm
        class="m-auto flex flex-col max-sm:w-full sm:w-fit max-w-full gap-2 sm:min-w-96 p-2 my-8"
        :schema="schema"
        :state="state"
        @submit="submitAction"
    >
        <h1 class="mx-auto font-bold text-xl">Регистрация</h1>
        <UFormGroup label="ФИО" name="name">
            <UInput
                v-model="state.name"
                placeholder="Кабарухин Евгений Деплоевич"
            />
        </UFormGroup>
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

        <UFormGroup
            class="w-full flex flex-col"
            label="Повторите пароль"
            name="passwordRepeat"
        >
            <UInput
                v-model="state.passwordRepeat"
                type="password"
                placeholder="Повторите пароль"
            />
        </UFormGroup>

        <UButton type="submit" :ui="{ width: '100%' }" label="Регистрация" />
        <div class="flex justify-between">
            <h2 class="text-secondary">Уже зарегистрированы?</h2>
            <ULink to="/auth/login" class="text-primary">Авторизация</ULink>
        </div>
        <UDivider label="ИЛИ" />
        <UButton @click="autoregister">Авторегистрация с входом (PROD Mode)</UButton>
    </UForm>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { User } from "~/types/user";
import {autoregister} from "#imports";

definePageMeta({
    title: "Регистрация"
})

const schema = z.object({
    name: z
        .string()
        .min(1, { message: "Имя не должно быть пустым" })
        .max(255, {
            message: "Имя должно быть длиной максимум в 255 символов",
        }),
    email: z.string().email("Неверный формат почты"),
    password: z
        .string()
        .min(8, { message: "Пароль должен быть длиной минимум в 8 символов" }),
    passwordRepeat: z.string().refine(
        (arg) => {
            return arg === state.value.password;
        },
        { message: "Пароли должны совпадать" }
    ),
});

type Schema = z.output<typeof schema>;

const state = ref({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
});

const router = useRouter();
const { $api } = useNuxtApp();

const toast = useToast();

const submitAction = async (event: FormSubmitEvent<Schema>) => {
    event.preventDefault();
    $api<User>("/auth/register", {
        method: "POST",
        body: {
            ...state.value,
            passwordRepeat: undefined,
        },
    })
        .then(() => {
            router.push({
                path: "/auth/login",
                query: {
                    email: state.value.email,
                },
            });
        })
        .catch((err) => {
            if (err.statusCode === 409) {
                toast.add({
                    color: "rose",
                    title: "Ошибка регистрации",
                    description: "Пользователь с такой почтой уже существует",
                });
            }
        });
};
</script>

<style></style>
