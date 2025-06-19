<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <div
        class="flex items-center justify-between p-6 border-b dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Tambah Kategori Baru
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Quick Category Buttons -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Pilih cepat:
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(cat, index) in quickCategories"
              :key="index"
              @click="useSuggestedCategory(cat)"
              class="px-3 py-1 text-sm border rounded-full hover:shadow-md transition-all"
              :style="{ borderColor: cat.color, color: cat.color }"
              :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
              :disabled="loading"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gray-300 dark:border-gray-600"
            ></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              >atau</span
            >
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nama Kategori
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="Contoh: Honeymoon"
            />
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
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["close"]);
const weddingStore = useWeddingStore();

const form = reactive({
  name: "",
  color: "#EF4444",
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
];

const quickCategories = [
  { name: "Honeymoon", color: "#EC4899" },
  { name: "Cincin", color: "#F59E0B" },
  { name: "Legal", color: "#6B7280" },
  { name: "Beauty", color: "#8B5CF6" },
  { name: "Gift", color: "#14B8A6" },
];

const useSuggestedCategory = async (category) => {
  loading.value = true;
  try {
    await weddingStore.addCategory(category.name, category.color);
    emit("close");
  } catch (error) {
    console.error("Error adding category:", error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await weddingStore.addCategory(form.name, form.color);
    emit("close");
  } catch (error) {
    console.error("Error adding category:", error);
  } finally {
    loading.value = false;
  }
};
</script>
