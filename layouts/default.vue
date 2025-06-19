<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav
      class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1
              class="text-xl sm:text-2xl font-dancing font-bold text-pink-600 dark:text-pink-400"
            >
              💒 Wedding Planner
            </h1>
          </div>

          <div
            class="flex items-center space-x-2 sm:space-x-4"
            v-if="authStore.user"
          >
            <!-- Theme<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl sm:text-2xl font-dancing font-bold text-pink-600 dark:text-pink-400">
              💒 Wedding Planner
            </h1>
          </div>

          <div class="flex items-center space-x-2 sm:space-x-4" v-if="authStore.user">
            <!-- Theme Toggle -->
            <ThemeToggle />

            <!-- Wedding countdown -->
            <button
              @click="showWeddingDateModal = true"
              class="bg-pink-100 dark:bg-pink-900/30 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
            >
              <span
                class="text-pink-800 dark:text-pink-300 font-medium"
                v-if="weddingStore.daysUntilWedding !== null"
              >
                <span class="hidden sm:inline"
                  >{{ weddingStore.daysUntilWedding }} hari lagi</span
                >
                <span class="sm:hidden"
                  >{{ weddingStore.daysUntilWedding }}h</span
                >
                ❤️
              </span>
              <span class="text-pink-800 dark:text-pink-300" v-else>
                <CalendarIcon class="h-4 w-4 inline sm:hidden" />
                <span class="hidden sm:inline">Set tanggal pernikahan</span>
              </span>
            </button>

            <button
              @click="authStore.logout"
              class="btn btn-secondary text-xs sm:text-sm"
            >
              <ArrowRightOnRectangleIcon class="h-4 w-4 sm:hidden" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Urgent Tasks Alert -->
    <div
      v-if="weddingStore.urgentTasks.length > 0"
      class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-3 sm:p-4 mx-4 mt-4 rounded"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon
            class="h-5 w-5 text-red-400 dark:text-red-500"
          />
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700 dark:text-red-300">
            <strong>{{ weddingStore.urgentTasks.length }} task urgent</strong>
            <span class="hidden sm:inline">memerlukan perhatian segera!</span>
          </p>
          <div class="mt-2 text-sm text-red-600 dark:text-red-400 sm:hidden">
            <p>Perlu perhatian!</p>
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
import {
  ExclamationTriangleIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

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
