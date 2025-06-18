<template>
  <div class="space-y-6">
    <div
      v-for="category in weddingStore.categories"
      :key="category.id"
      class="card"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div
            class="w-4 h-4 rounded-full mr-3"
            :style="{ backgroundColor: category.color }"
          ></div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ category.name }}
          </h3>
          <span class="ml-2 text-sm text-gray-500">
            ({{ getCategoryTasks(category.name).length }})
          </span>
        </div>
      </div>

      <div
        :ref="(el) => setSortableContainer(el, category.name)"
        class="space-y-3 min-h-[50px]"
        :data-category="category.name"
      >
        <TaskCard
          v-for="task in getCategoryTasks(category.name)"
          :key="task.id"
          :task="task"
          :data-task-id="task.id"
          @update="updateTask"
          @delete="deleteTask"
        />

        <div
          v-if="getCategoryTasks(category.name).length === 0"
          class="text-center py-8 text-gray-400"
        >
          Belum ada task di kategori ini
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sortable from "sortablejs";

const weddingStore = useWeddingStore();
const sortableInstances = ref(new Map());

const getCategoryTasks = (categoryName) => {
  return weddingStore.tasksByCategory[categoryName] || [];
};

const setSortableContainer = (el, categoryName) => {
  if (!el) return;

  // Destroy existing sortable instance
  if (sortableInstances.value.has(categoryName)) {
    sortableInstances.value.get(categoryName).destroy();
  }

  const sortable = new Sortable(el, {
    group: "tasks",
    animation: 200,
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    onEnd: async (evt) => {
      const taskId = evt.item.getAttribute("data-task-id");
      const newCategoryName = evt.to.getAttribute("data-category");
      const newIndex = evt.newIndex;

      await weddingStore.updateTaskOrder(taskId, newIndex, newCategoryName);
    },
  });

  sortableInstances.value.set(categoryName, sortable);
};

const updateTask = async (taskId, updates) => {
  await weddingStore.updateTask(taskId, updates);
};

const deleteTask = async (taskId) => {
  await weddingStore.deleteTask(taskId);
};

onUnmounted(() => {
  sortableInstances.value.forEach((instance) => instance.destroy());
  sortableInstances.value.clear();
});
</script>
