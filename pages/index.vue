<template>
  <div
    v-if="authStore.loading"
    class="flex items-center justify-center min-h-screen"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6"
      >
        <div>
          <h1
            class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Wedding Checklist
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Kelola persiapan pernikahan Anda
          </p>
        </div>

        <div class="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
          <button
            @click="showAddTask = true"
            class="btn btn-primary flex-1 sm:flex-initial"
          >
            <PlusIcon class="h-5 w-5 sm:hidden" />
            <span class="hidden sm:inline">+ Tambah Task</span>
            <span class="sm:hidden">Task</span>
          </button>
          <button
            @click="showCategoryManager = true"
            class="btn btn-secondary flex-1 sm:flex-initial"
          >
            <FolderPlusIcon class="h-5 w-5 sm:hidden" />
            <span class="hidden sm:inline">Kelola Kategori</span>
            <span class="sm:hidden">Kategori</span>
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div
          class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700"
        >
          <div
            class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
          >
            {{ weddingStore.tasks.length }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Total Tasks
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700"
        >
          <div
            class="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400"
          >
            {{ weddingStore.completedTasks.length }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Selesai
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700"
        >
          <div
            class="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400"
          >
            {{ weddingStore.urgentTasks.length }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Urgent
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700"
        >
          <div
            class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            {{ completionPercentage }}%
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Progress
          </div>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div
        class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full sm:w-fit overflow-x-auto"
      >
        <button
          v-for="mode in viewModes"
          :key="mode.value"
          @click="weddingStore.viewMode = mode.value"
          :class="[
            'px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 whitespace-nowrap',
            weddingStore.viewMode === mode.value
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
          ]"
        >
          <component :is="mode.icon" class="h-4 w-4" />
          <span>{{ mode.label }}</span>
        </button>
      </div>
    </div>

    <!-- Task Views -->
    <TaskListView v-if="weddingStore.viewMode === 'list'" />
    <TaskGridView v-else-if="weddingStore.viewMode === 'grid'" />
    <TaskCalendarView v-else />

    <!-- Modals -->
    <AddTaskModal v-if="showAddTask" @close="showAddTask = false" />
    <CategoryManager
      v-if="showCategoryManager"
      @close="showCategoryManager = false"
    />
  </div>
</template>

<script setup>
import {
  ListBulletIcon,
  Squares2X2Icon,
  CalendarIcon,
  PlusIcon,
  FolderPlusIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const weddingStore = useWeddingStore();
const showAddTask = ref(false);
const showCategoryManager = ref(false);

const viewModes = [
  { value: "list", label: "List", icon: ListBulletIcon },
  { value: "grid", label: "Grid", icon: Squares2X2Icon },
  { value: "calendar", label: "Kalender", icon: CalendarIcon },
];

const completionPercentage = computed(() => {
  if (weddingStore.tasks.length === 0) return 0;
  return Math.round(
    (weddingStore.completedTasks.length / weddingStore.tasks.length) * 100
  );
});
</script>
