<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <div
        class="flex items-center justify-between p-6 border-b dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Edit Kategori
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nama Kategori
          </label>
          <input v-model="form.name" type="text" required class="input" />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Warna
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              @click="form.color = color"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-all',
                form.color === color
                  ? 'ring-2 ring-offset-2 ring-gray-400'
                  : 'border-gray-200',
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="emit('close')"
            class="btn btn-secondary"
          >
            Batal
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading">Menyimpan...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps(["category"]);
const emit = defineEmits(["close", "update"]);

const form = reactive({
  name: props.category.name,
  color: props.category.color,
});

const loading = ref(false);

const colors = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#06B6D4",
  "#6366F1",
];

const handleSubmit = async () => {
  loading.value = true;
  try {
    await emit("update", props.category.id, {
      name: form.name,
      color: form.color,
    });
  } finally {
    loading.value = false;
  }
};
</script>
