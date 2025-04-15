<script lang="ts" setup>
import { useAuthCacheStore } from "~/store/auth";
import { useReservationsStore } from "~/store/reservations";
import type { BookInstance, Book } from "~/types/book";
import {z} from "zod";

definePageMeta({
    middleware: ["instance"],
    title: "Объявление",
});

const route = useRoute();
const { isAuthenticated } = storeToRefs(useAuthCacheStore());

const instance = ref(route.meta.instance as BookInstance);
const book = ref<Book>({

})

const { reserveInstance, cancelReservation, confirmReservation } = useReservationsStore();
const { reservations } = storeToRefs(useReservationsStore());
const {$api} = useNuxtApp()

const myReservation = computed(() =>
    reservations.value.find(
        (reservation) => reservation.instanceId !== instance.value.id
    )
);

const myReservationTime = computed(() =>
    myReservation.value ? new Date(myReservation.value.createdAt) : null
);

const canReserve = computed(
    () => reservations.value.length < useReservationLimit
);

const fetchBook = async () => {
  book.value = await $api(`/books/${instance.value.bookId}`)
}

const reportSchema = z.object({
  text: z.string().min(1, {message: "Сообщение жалобы не должно быть пустым"}).max(255, {message: "Сообщение должно быть менее 255 символов в длину"})
})

const reportModalState =ref<boolean>(false)
const reportItem = ref<{
  reservationId: string,
  text: string
}>({
  reservationId: myReservation.value?.id || '',
  text: ''
})

const showReportModal = () => {
  reportModalState.value = true
  reportItem.value = {
  reservationId: myReservation.value?.id || '',
  text: ''
}
}

const sendReport = () =>{
  $api('/reports', {
    method: "POST",
    body: reportItem.value
  }).then((_)=>{
    navigateTo(`/book/${route.params.id as string}`)
  }).catch((_) => {
    navigateTo(`/book/${route.params.id as string}`)
  })
}

fetchBook()
</script>

<template>
    <div class="p-4 mx-auto max-w-[1000px] space-y-4">
      <UModal v-model="reportModalState">
        <UForm :schema="reportSchema" :state="reportItem" class="flex flex-col gap-2 p-6" @submit.prevent="sendReport" >
          <h2>Подать жалобу</h2>
          <UFormGroup name="text" label="Текст жалобы">
            <UTextarea name="text" placeholder="Опишите проблемы" v-model="reportItem.text"/>
          </UFormGroup>
          <div class="flex justify-between w-full">
            <UButton @click="reportModalState=false" label="Закрыть"/>
            <UButton type="submit" color="red" label="Подать жалобу"/>
          </div>
        </UForm>
      </UModal>
      <UAlert
          class="text-2xl"
      >
        <template #avatar="{avatar}">
          <UtilAttachment v-bind="avatar" :id="instance.photoId" class="lg-sm:h-[400px] sm:w-1/6 max-sm:mx-auto max-sm:hidden" />
          <UAvatar :src="`/api/attachments/${instance.photoId}/content`" class="sm:hidden" :alt="book.name"/>
        </template>
        <template #title="{title}">
          <h1 v-bind="title" class="text-2xl ml-2 font-bold">{{book.name}}</h1>
        </template>
        <template #description="{description}">
          <div v-bind="description" class="space-x-2 space-y-2 w-fit">
            <UBadge class="w-fit ml-2" icon="i-heroicons-book-open" size="sm" :label="book.genre"/>
            <UBadge class="w-fit" icon="i-heroicons-academic-cap" size="sm" :label="book.author"/>
            <UBadge class="w-fit" icon="i-heroicons-calendar" size="sm" :label="book.editionYear"/>
            <UBadge class="w-fit" icon="i-heroicons-document" size="sm" :label="book.publishingCompany"/>
            <UBadge class="w-fit" icon="i-heroicons-language" size="sm" :label="book.language"/>
            <UBadge class="w-fit" icon="i-heroicons-document-duplicate" size="sm" :label="book.pages"/>
          </div>
        </template>

      </UAlert>
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <UBadge color="gray">
                    <UIcon name="heroicons:user-solid" class="mr-1" />
                    {{ instance.owner.name }}
                </UBadge>
                <UPopover mode="hover">
                    <UBadge color="gray">
                        <UIcon name="heroicons:map" class="mr-1" />
                        {{ instance.location.name }}
                    </UBadge>
                    <template #panel>
                        <UCard>
                            <template #header>
                                <div class="flex gap-2 items-center">
                                    <UIcon name="heroicons:map-pin" />
                                    {{ instance.location.address }}
                                </div>
                                <p
                                    v-if="instance.location.extra"
                                    class="opacity-70"
                                >
                                    {{ instance.location.extra }}
                                </p>
                            </template>
                        </UCard>
                    </template>
                </UPopover>
            </div>
            <UDivider />
            <p>Состояние: {{ useConditionString[instance.condition] }}</p>
            <p v-if="instance.description.length > 0">Описание состояния: {{ instance.description }}</p>
            <div
                v-if="instance.status === 'PLACED'"
                class="flex items-center gap-8"
            >
                <UButton
                    v-if="isAuthenticated"
                    :disabled="!canReserve"
                    label="Забронировать"
                    @click="reserveInstance(instance.id).then((reservation) => {
                        instance = reservation.instance
                    })"
                />
                <p v-else-if="!canReserve">
                    Вы не можете взять больше {{ useReservationLimit }} книг за
                    раз
                </p>
                <UButton
                    v-else
                    :to="{
                        path: '/auth/login',
                        query: { redirect: route.path },
                    }"
                    label="Войти чтобы забронировать"
                />
            </div>
            <div v-else-if="instance.status === 'RESERVED'">
                <div v-if="myReservation" class="flex flex-col gap-2">
                    <UButtonGroup size="sm">
                        <UBadge variant="soft">
                            Забронировано вами
                            <span v-if="myReservationTime">
                                в
                                {{ myReservationTime.toLocaleTimeString("ru") }}
                                |
                                {{ myReservationTime.toLocaleDateString("ru") }}
                            </span>
                        </UBadge>
                        <UButton label="Личный кабинет" to="/me" />
                    </UButtonGroup>
                    <UButtonGroup>
                        <UButton variant="soft" color="red" @click="cancelReservation(myReservation.id).then(() => {
                            instance.status = 'PLACED'
                        })">Отменить</UButton>
                        <UButton variant="soft" color="green" @click="confirmReservation(myReservation.id).then(() => {
                            instance.status = 'RECIEVED'
                        })">Подтвердить</UButton>
                      <UButton variant="soft" color="red" @click="showReportModal" label="Отправить жалобу"/>
                    </UButtonGroup>
                </div>
                <UBadge v-else variant="soft" color="rose">
                    Забронировано
                </UBadge>
            </div>
            <div v-else-if="instance.status === 'MODERATION'">
                <UBadge variant="soft" color="yellow">На модерации</UBadge>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
