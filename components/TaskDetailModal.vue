<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Detail Task</h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <h4 class="text-xl font-semibold text-gray-900 mb-2">
            {{ task.title }}
          </h4>
          <div class="flex items-center space-x-4">
            <span
              :class="[
                'px-3 py-1 text-sm rounded-full border',
                `priority-${task.priority}`,
              ]"
            >
              {{ getPriorityText(task.priority) }}
            </span>

            <span class="text-sm text-gray-500">{{ task.category }}</span>

            <span
              v-if="task.completed"
              class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
            >
              ✓ Selesai
            </span>
          </div>
        </div>

        <div v-if="task.description" class="prose prose-sm">
          <p class="text-gray-700">{{ task.description }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="task.dueDate">
            <h5 class="text-sm font-medium text-gray-700 mb-1">
              Tanggal Target
            </h5>
            <div class="flex items-center text-sm text-gray-600">
              <CalendarIcon class="h-4 w-4 mr-2" />
              {{ formatDate(task.dueDate) }}
              <span
                v-if="isDueSoon"
                class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
              >
                {{ getDaysUntilDue() }} hari lagi
              </span>
            </div>
          </div>

          <div v-if="task.location">
            <h5 class="text-sm font-medium text-gray-700 mb-1">Lokasi</h5>
            <div class="flex items-center text-sm text-gray-600">
              <MapPinIcon class="h-4 w-4 mr-2" />
              {{ task.location }}
            </div>
          </div>
        </div>

        <div v-if="task.notes">
          <h5 class="text-sm font-medium text-gray-700 mb-1">Catatan</h5>
          <p class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {{ task.notes }}
          </p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t">
          <div class="flex items-center">
            <input
              v-model="taskCompleted"
              @change="toggleCompleted"
              type="checkbox"
              class="h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
            />
            <span class="ml-2 text-sm text-gray-700">
              {{ taskCompleted ? "Task selesai" : "Tandai selesai" }}
            </span>
          </div>

          <div class="flex space-x-2">
            <button @click="openEdit" class="btn btn-secondary">
              Edit Task
            </button>
            <button @click="confirmDelete" class="btn btn-danger">Hapus</button>
          </div>
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
  </div>
</template>

<script setup>
import { XMarkIcon, CalendarIcon, MapPinIcon } from "@heroicons/vue/24/outline";

const props = defineProps(["task"]);
const emit = defineEmits(["close", "update"]);

const taskCompleted = ref(props.task.completed);
const showEdit = ref(false);

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
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isDueSoon = computed(() => {
  if (!props.task.dueDate) return false;
  const daysUntil = getDaysUntilDue();
  return daysUntil <= 7 && daysUntil >= 0;
});

const getDaysUntilDue = () => {
  if (!props.task.dueDate) return null;
  const today = new Date();
  const dueDate = new Date(props.task.dueDate);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const toggleCompleted = () => {
  emit("update", props.task.id, { completed: taskCompleted.value });
};

const openEdit = () => {
  showEdit.value = true;
};

const handleUpdate = (updates) => {
  emit("update", props.task.id, updates);
  showEdit.value = false;
};

const confirmDelete = () => {
  if (confirm("Yakin ingin menghapus task ini?")) {
    emit("delete", props.task.id);
    emit("close");
  }
};
</script>
