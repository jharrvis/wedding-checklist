<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">
          Set Tanggal Pernikahan
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pernikahan
            </label>
            <input
              v-model="selectedDate"
              type="date"
              required
              class="input"
              :min="today"
            />
          </div>

          <div v-if="selectedDate" class="bg-pink-50 p-4 rounded-lg">
            <div class="text-center">
              <p class="text-sm text-pink-700 mb-2">Hari pernikahan Anda:</p>
              <p class="text-lg font-semibold text-pink-800">
                {{ formatSelectedDate }}
              </p>
              <p class="text-sm text-pink-600 mt-2">
                <span v-if="daysUntil > 0">{{ daysUntil }} hari lagi! 💕</span>
                <span v-else-if="daysUntil === 0"
                  >Hari ini adalah hari bahagia Anda! 🎉</span
                >
                <span v-else>Semoga pernikahan Anda bahagia! 💐</span>
              </p>
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

const selectedDate = ref(
  weddingStore.weddingDate
    ? new Date(weddingStore.weddingDate).toISOString().split("T")[0]
    : ""
);
const loading = ref(false);

const today = new Date().toISOString().split("T")[0];

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return "";
  return new Date(selectedDate.value).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const daysUntil = computed(() => {
  if (!selectedDate.value) return null;
  const today = new Date();
  const wedding = new Date(selectedDate.value);
  const diffTime = wedding.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const handleSubmit = async () => {
  loading.value = true;

  try {
    weddingStore.setWeddingDate(new Date(selectedDate.value));
    emit("close");
  } catch (error) {
    console.error("Error setting wedding date:", error);
  } finally {
    loading.value = false;
  }
};
</script>
