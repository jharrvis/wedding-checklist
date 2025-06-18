<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Wedding Checklist</h1>
          <p class="text-gray-600 mt-1">Kelola persiapan pernikahan Anda</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <button @click="showAddTask = true" class="btn btn-primary">
            + Tambah Task
          </button>
          <button @click="showAddCategory = true" class="btn btn-secondary">
            + Kategori Baru
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-2xl font-bold text-gray-900">
            {{ weddingStore.tasks.length }}
          </div>
          <div class="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-2xl font-bold text-green-600">
            {{ weddingStore.completedTasks.length }}
          </div>
          <div class="text-sm text-gray-600">Selesai</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-2xl font-bold text-red-600">
            {{ weddingStore.urgentTasks.length }}
          </div>
          <div class="text-sm text-gray-600">Urgent</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border">
          <div class="text-2xl font-bold text-blue-600">
            {{ completionPercentage }}%
          </div>
          <div class="text-sm text-gray-600">Progress</div>
        </div>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          v-for="mode in viewModes"
          :key="mode.value"
          @click="weddingStore.viewMode = mode.value"
          :class="[
            'px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1',
            weddingStore.viewMode === mode.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
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
    <AddCategoryModal v-if="showAddCategory" @close="showAddCategory = false" />
  </div>
</template>

<script setup>
import {
  ListBulletIcon,
  Squares2X2Icon,
  CalendarIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  middleware: "auth",
});

const weddingStore = useWeddingStore();
const showAddTask = ref(false);
const showAddCategory = ref(false);

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
