<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Edit Task</h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Judul Task</label
          >
          <input v-model="form.title" type="text" required class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Deskripsi</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            class="input"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Kategori</label
          >
          <select v-model="form.category" required class="input">
            <option
              v-for="category in weddingStore.categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Prioritas</label
          >
          <select v-model="form.priority" required class="input">
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Tanggal Target</label
          >
          <input v-model="form.dueDate" type="date" class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Lokasi</label
          >
          <input v-model="form.location" type="text" class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Catatan</label
          >
          <textarea v-model="form.notes" rows="2" class="input"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <div class="flex items-center">
            <input
              v-model="form.completed"
              type="checkbox"
              class="h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
            />
            <span class="ml-2 text-sm text-gray-700">Task sudah selesai</span>
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
            <span v-else>Update Task</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps(["task"]);
const emit = defineEmits(["close", "update"]);
const weddingStore = useWeddingStore();

const form = reactive({
  title: props.task.title,
  description: props.task.description || "",
  category: props.task.category,
  priority: props.task.priority,
  dueDate: props.task.dueDate
    ? new Date(props.task.dueDate).toISOString().split("T")[0]
    : "",
  location: props.task.location || "",
  notes: props.task.notes || "",
  completed: props.task.completed,
});

const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;

  try {
    const updates = {
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate) : null,
      location: form.location,
      notes: form.notes,
      completed: form.completed,
    };

    emit("update", updates);
  } catch (error) {
    console.error("Error updating task:", error);
  } finally {
    loading.value = false;
  }
};
</script>
