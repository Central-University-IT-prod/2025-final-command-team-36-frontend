<template>
    <UTooltip
        class="h-full w-full sm:max-w-80 aspect-book"
        text="Нажмите для загрузки"
    >
        <div
            class="relative w-full h-full flex justify-center items-center bg-gray-300 dark:bg-gray-500 bg-opacity-20 dark:bg-opacity-20 rounded-md"
            @click="handleImageUpload"
        >
            <div v-if="isUploading" class="absolute w-full bottom-0">
                <UProgress animation="carousel"/>
            </div>
            <UFormGroup v-else class="absolute bottom-0 p-2 font-bold text-xl" :name="props.name" />
            <UtilAttachment
                v-if="model ? model.length > 0 : false"
                :id="model!!"
            />
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
        </div>
    </UTooltip>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();

// InstanceImageId
const model = defineModel<string>();
const props = defineProps<{
    name: string
}>()

const isUploading = ref(false)

const handleImageUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png";
    fileInput.onchange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.type === "image/jpeg" || file.type === "image/png") {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    isUploading.value = true
                    const response = await $api<{
                        id: string;
                    }>("/attachments", {
                        method: "POST",
                        body: formData,
                    });
                    isUploading.value = false
                    model.value = response.id;
                } catch (error) {
                    isUploading.value = false
                    console.error("Upload failed:", error);
                }
            } else {
                alert("Only JPEG and PNG images are allowed.");
            }
        }
    };
    fileInput.click();
};
</script>
