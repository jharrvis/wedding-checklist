<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-3 flex-1">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleCompleted"
          class="mt-1 h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
        />

        <div class="flex-1 min-w-0">
          <h4
            :class="[
              'text-sm font-medium',
              task.completed ? 'line-through text-gray-500' : 'text-gray-900',
            ]"
          >
            {{ task.title }}
          </h4>

          <p v-if="task.description" class="text-xs text-gray-600 mt-1">
            {{ task.description }}
          </p>

          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full border',
                `priority-${task.priority}`,
              ]"
            >
              {{ getPriorityText(task.priority) }}
            </span>

            <span
              v-if="task.dueDate"
              class="text-xs text-gray-500 flex items-center"
            >
              <CalendarIcon class="h-3 w-3 mr-1" />
              {{ formatDate(task.dueDate) }}
            </span>

            <span
              v-if="task.location"
              class="text-xs text-gray-500 flex items-center"
            >
              <MapPinIcon class="h-3 w-3 mr-1" />
              {{ task.location }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2 ml-2">
        <button
          @click="showEdit = true"
          class="text-gray-400 hover:text-gray-600 p-1"
        >
          <PencilIcon class="h-4 w-4" />
        </button>

        <button
          @click="confirmDelete"
          class="text-gray-400 hover:text-red-600 p-1"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditTaskModal
      v-if="showEdit"
      :task="task"
      @close="showEdit = false"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import {
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps(["task"]);
const emit = defineEmits(["update", "delete"]);

const showEdit = ref(false);

const toggleCompleted = () => {
  emit("update", props.task.id, { completed: !props.task.completed });
};

const handleUpdate = (updates) => {
  emit("update", props.task.id, updates);
  showEdit.value = false;
};

const confirmDelete = () => {
  if (confirm("Yakin ingin menghapus task ini?")) {
    emit("delete", props.task.id);
  }
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
    year: "numeric",
  });
};
</script>
