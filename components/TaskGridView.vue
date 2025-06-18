<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    <div
      v-for="category in weddingStore.categories"
      :key="category.id"
      class="space-y-4"
    >
      <div class="card">
        <div class="flex items-center mb-4">
          <div
            class="w-4 h-4 rounded-full mr-3"
            :style="{ backgroundColor: category.color }"
          ></div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ category.name }}
          </h3>
        </div>

        <div
          :ref="(el) => setSortableContainer(el, category.name)"
          class="space-y-3 min-h-[100px]"
          :data-category="category.name"
        >
          <div
            v-for="task in getCategoryTasks(category.name)"
            :key="task.id"
            :data-task-id="task.id"
            class="p-3 bg-gray-50 rounded-lg border cursor-move hover:shadow-sm transition-shadow"
            @click="openTaskDetail(task)"
          >
            <div class="flex items-start justify-between mb-2">
              <input
                type="checkbox"
                :checked="task.completed"
                @change.stop="toggleCompleted(task.id)"
                class="h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
              />

              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  `priority-${task.priority}`,
                ]"
              >
                {{ getPriorityText(task.priority) }}
              </span>
            </div>

            <h4
              :class="[
                'text-sm font-medium mb-1',
                task.completed ? 'line-through text-gray-500' : 'text-gray-900',
              ]"
            >
              {{ task.title }}
            </h4>

            <div class="space-y-1">
              <div
                v-if="task.dueDate"
                class="text-xs text-gray-500 flex items-center"
              >
                <CalendarIcon class="h-3 w-3 mr-1" />
                {{ formatDate(task.dueDate) }}
              </div>

              <div
                v-if="task.location"
                class="text-xs text-gray-500 flex items-center"
              >
                <MapPinIcon class="h-3 w-3 mr-1" />
                {{ task.location }}
              </div>
            </div>
          </div>

          <div
            v-if="getCategoryTasks(category.name).length === 0"
            class="text-center py-8 text-gray-400 text-sm"
          >
            Kosong
          </div>
        </div>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <TaskDetailModal
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @update="handleTaskUpdate"
    />
  </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { CalendarIcon, MapPinIcon } from "@heroicons/vue/24/outline";

const weddingStore = useWeddingStore();
const sortableInstances = ref(new Map());
const selectedTask = ref(null);

const getCategoryTasks = (categoryName) => {
  return weddingStore.tasksByCategory[categoryName] || [];
};

const setSortableContainer = (el, categoryName) => {
  if (!el) return;

  if (sortableInstances.value.has(categoryName)) {
    sortableInstances.value.get(categoryName).destroy();
  }

  const sortable = new Sortable(el, {
    group: "tasks-grid",
    animation: 200,
    ghostClass: "sortable-ghost",
    onEnd: async (evt) => {
      const taskId = evt.item.getAttribute("data-task-id");
      const newCategoryName = evt.to.getAttribute("data-category");
      const newIndex = evt.newIndex;

      await weddingStore.updateTaskOrder(taskId, newIndex, newCategoryName);
    },
  });

  sortableInstances.value.set(categoryName, sortable);
};

const toggleCompleted = async (taskId) => {
  const task = weddingStore.tasks.find((t) => t.id === taskId);
  if (task) {
    await weddingStore.updateTask(taskId, { completed: !task.completed });
  }
};

const openTaskDetail = (task) => {
  selectedTask.value = task;
};

const handleTaskUpdate = async (taskId, updates) => {
  await weddingStore.updateTask(taskId, updates);
  selectedTask.value = null;
};

const getPriorityText = (priority) => {
  const priorities = {
    urgent: "Urgent",
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",
  };
  return priorities[priority] || priority;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

onUnmounted(() => {
  sortableInstances.value.forEach((instance) => instance.destroy());
  sortableInstances.value.clear();
});
</script>
