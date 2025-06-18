<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">
          Tambah Kategori Baru
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="p-6">
        <!-- Suggested Categories -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">
            Kategori yang Disarankan:
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="category in suggestedCategories"
              :key="category.name"
              @click="useSuggestedCategory(category)"
              class="p-3 text-left border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors"
            >
              <div class="flex items-center">
                <div
                  class="w-4 h-4 rounded-full mr-3"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-sm">{{ category.name }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="border-t pt-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">
            Atau Buat Kategori Sendiri:
          </h4>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nama Kategori</label
              >
              <input
                v-model="form.name"
                type="text"
                required
                class="input"
                placeholder="Contoh: Honeymoon"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Warna</label
              >
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
                <span v-else>Simpan Kategori</span>
              </button>
            </div>
          </form>
        </div>
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
  "#F97316",
  "#84CC16",
  "#06B6D4",
  "#6366F1",
];

const suggestedCategories = [
  { name: "Honeymoon", color: "#EC4899" },
  { name: "Cincin", color: "#F59E0B" },
  { name: "Keuangan", color: "#10B981" },
  { name: "Legal & Dokumen", color: "#6B7280" },
  { name: "Beauty & Spa", color: "#8B5CF6" },
  { name: "Entertainment", color: "#3B82F6" },
  { name: "Gift & Souvenir", color: "#14B8A6" },
  { name: "Acara Lainnya", color: "#EF4444" },
  { name: "Logistik", color: "#F97316" },
  { name: "Keamanan", color: "#84CC16" },
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
