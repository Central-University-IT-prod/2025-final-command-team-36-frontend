<template>
  <div class="flex flex-col gap-2 w-full p-6">
    <h1 class="text-2xl">Жалобы</h1>
    <ProgressLoading :loading="!(loaded)" :empty="moderateReports.length===0"/>
    <div class="flex flex-col gap-2">
      <AdminElementCard v-for="item in moderateReports" :keyg="item.id" edit-label="Подтвердить" delete-label="Отклонить" @delete="rejectInstance(item)" @edit="approveInstance(item)">
        <div class="flex max-sm:flex-col gap-2">
          <UtilAttachment :id="item.reservation.instance.photoId" class="max-sm:w-full sm:w-1/2 md:w-1/3"/>

          <div class="flex flex-col gap-2">
            <h2 class="text-2xl">Жалоба</h2>
            <p class="opacity-80">{{item.text}}</p>
            <div class="flex gap-2">
              <h3 class="text-xl break-all">{{ item.reservation.instance.description }}</h3>
            </div>
            <div class="flex flex-col gap-2">
              <UBadge class="w-fit" icon="i-heroicons-user" size="sm" :label="item.reservation.instance.owner.name"/>
            </div>
          </div>
        </div>
      </AdminElementCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ReportType} from "~/types/report";

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({
  title: "Модерация экземпляров"
})

const loaded = ref<boolean>(false);

const moderateReports = ref<ReportType[]>([])

const {$api} = useNuxtApp()

const fetchBooks = async () => {
  loaded.value = false;
  $api<ReportType[]>('/reports').then((res) => {
    moderateReports.value = res
    loaded.value = true;
  }).catch(_=>{
    loaded.value = true;
  })
}

fetchBooks()

const approveInstance = async (report: ReportType ) => {
  $api(`/reports/${report.id}/approve`, {method: "POST"}).then((_)=>{
    fetchBooks()
  })
}

const rejectInstance = (report: ReportType) => {
  $api(`/reports/${report.id}/reject`, {method: "POST"}).then((_)=>{
    fetchBooks()
  })
}
</script>


<style scoped>

</style>