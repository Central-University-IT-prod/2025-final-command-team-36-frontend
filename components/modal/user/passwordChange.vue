<template>
  <UModal>
    <UForm
        class="m-auto flex flex-col w-fit gap-2 min-w-96 my-8"
        :schema="schema"
        :state="state"
        @submit.prevent="submitAction"
    >
        <h1 class="mx-auto font-bold text-xl">Смена пароля</h1>
        
        <UFormGroup class="w-full flex flex-col" label="Старый пароль" name="oldPassword">
            <UInput
                v-model="state.oldPassword"
                type="password"
                placeholder="Введите старый пароль"
            />
        </UFormGroup>

        <UFormGroup class="w-full flex flex-col" label="Пароль" name="newPassword">
            <UInput
                v-model="state.newPassword"
                type="password"
                placeholder="Введите новый пароль"
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
                placeholder="Повторите новый пароль"
            />
        </UFormGroup>

        <UButton type="submit" :ui="{ width: '100%' }" label="Сменить пароль" />
    </UForm>
  </UModal>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useAuthCacheStore } from "~/store/auth";

const toast = useToast();
const { $api } = useNuxtApp()

const schema = z.object({
    oldPassword: z
        .string()
        .min(8, { message: "Пожалуйста введите действительный старый пароль"}),
    newPassword: z
        .string()
        .min(8, { message: "Пароль должен быть длиной минимум в 8 символов" }),
    passwordRepeat: z.string().refine(
        (arg) => {
            return arg === state.value.newPassword;
        },
        { message: "Пароли должны совпадать" }
    ),
});

type Schema = z.output<typeof schema>;

const state = ref({
    oldPassword: "",
    newPassword: "",
    passwordRepeat: "",
});
const auth = useAuthCacheStore()

const submitAction = (event: FormSubmitEvent<Schema>) => {
  $api('/auth/change-password', {
    method: "POST",
    body: {
      oldPassword: state.value.oldPassword,
      newPassword: state.value.newPassword
    }
  }).then(() => {
    auth.user = null
    navigateTo('/')
  }).catch((err) => {
      if (err.statusCode === 400) {
          toast.add({
              color: "rose",
              title: "Ошибка смены пароля",
              description: "Неверный старый пароль",
          });
      }
  });
};
</script>