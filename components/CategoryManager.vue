<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
    >
      <div
        class="flex items-center justify-between p-6 border-b dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Kelola Kategori
        </h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="grid gap-3">
          <div
            v-for="category in weddingStore.categories"
            :key="category.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:shadow-md transition-shadow"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-full"
                :style="{ backgroundColor: category.color }"
              ></div>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ category.name }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ({{ getCategoryTaskCount(category.name) }} tasks)
              </span>
            </div>

            <div
              class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click="editCategory(category)"
                class="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="confirmDeleteCategory(category)"
                class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                :disabled="getCategoryTaskCount(category.name) > 0"
                :class="
                  getCategoryTaskCount(category.name) > 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                "
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <button
          @click="showAddForm = true"
          class="mt-4 w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-pink-300 hover:text-pink-600 transition-colors"
        >
          + Tambah Kategori Baru
        </button>
      </div>

      <div class="p-6 border-t dark:border-gray-700">
        <button @click="emit('close')" class="w-full btn btn-secondary">
          Tutup
        </button>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <EditCategoryModal
      v-if="editingCategory"
      :category="editingCategory"
      @close="editingCategory = null"
      @update="handleUpdateCategory"
    />

    <!-- Add Category Form -->
    <AddCategoryModal v-if="showAddForm" @close="showAddForm = false" />
  </div>
</template>

<script setup>
import { XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["close"]);
const weddingStore = useWeddingStore();

const editingCategory = ref(null);
const showAddForm = ref(false);

const getCategoryTaskCount = (categoryName) => {
  return weddingStore.tasksByCategory[categoryName]?.length || 0;
};

const editCategory = (category) => {
  editingCategory.value = category;
};

const confirmDeleteCategory = async (category) => {
  if (getCategoryTaskCount(category.name) > 0) {
    alert("Tidak dapat menghapus kategori yang masih memiliki task");
    return;
  }

  if (confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) {
    await weddingStore.deleteCategory(category.id);
  }
};

const handleUpdateCategory = async (categoryId, updates) => {
  await weddingStore.updateCategory(categoryId, updates);
  editingCategory.value = null;
};
</script>
