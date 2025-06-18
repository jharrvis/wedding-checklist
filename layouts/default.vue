<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-dancing font-bold text-pink-600">
              💒 Wedding Planner
            </h1>
          </div>

          <div class="flex items-center space-x-4" v-if="authStore.user">
            <!-- Wedding countdown -->
            <button
              @click="showWeddingDateModal = true"
              class="bg-pink-100 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition-colors"
            >
              <span
                class="text-pink-800 font-medium"
                v-if="weddingStore.daysUntilWedding !== null"
              >
                {{ weddingStore.daysUntilWedding }} hari lagi ❤️
              </span>
              <span class="text-pink-800" v-else>Set tanggal pernikahan</span>
            </button>

            <button @click="authStore.logout" class="btn btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Urgent Tasks Alert -->
    <div
      v-if="weddingStore.urgentTasks.length > 0"
      class="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            <strong>{{ weddingStore.urgentTasks.length }} task urgent</strong>
            memerlukan perhatian segera!
          </p>
          <div class="mt-2 text-sm text-red-600">
            <ul class="list-disc list-inside">
              <li
                v-for="task in weddingStore.urgentTasks.slice(0, 3)"
                :key="task.id"
              >
                {{ task.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <main>
      <slot />
    </main>

    <!-- Wedding Date Modal -->
    <WeddingDateModal
      v-if="showWeddingDateModal"
      @close="showWeddingDateModal = false"
    />
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const weddingStore = useWeddingStore();
const showWeddingDateModal = ref(false);

onMounted(() => {
  authStore.initAuth();

  watch(
    () => authStore.user,
    async (user) => {
      if (user) {
        await weddingStore.loadCategories();
        await weddingStore.loadTasks();
        await weddingStore.loadWeddingDate();
      } else {
        // Cleanup when user logs out
        weddingStore.cleanup();
      }
    },
    { immediate: true }
  );
});
</script>
