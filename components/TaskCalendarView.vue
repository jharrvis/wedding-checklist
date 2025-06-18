<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Kalender Task</h3>

      <div class="flex items-center space-x-4">
        <button
          @click="previousMonth"
          class="p-2 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <span class="text-lg font-medium">
          {{
            currentMonth.toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })
          }}
        </span>

        <button
          @click="nextMonth"
          class="p-2 text-gray-500 hover:text-gray-700"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 mb-4">
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="p-2 text-center text-sm font-medium text-gray-700"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(date, index) in calendarDates"
        :key="index"
        :class="[
          'min-h-[120px] p-2 border border-gray-200 rounded',
          date.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
          date.isToday ? 'bg-pink-50 border-pink-200' : '',
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <span
            :class="[
              'text-sm font-medium',
              date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
              date.isToday ? 'text-pink-600' : '',
            ]"
          >
            {{ date.day }}
          </span>
        </div>

        <div class="space-y-1">
          <div
            v-for="task in getTasksForDate(date.date)"
            :key="task.id"
            :class="[
              'text-xs p-1 rounded truncate cursor-pointer',
              `priority-${task.priority}`,
            ]"
            @click="openTaskDetail(task)"
            :title="task.title"
          >
            {{ task.title }}
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
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const weddingStore = useWeddingStore();
const currentMonth = ref(new Date());
const selectedTask = ref(null);

const dayHeaders = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const calendarDates = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

  const dates = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    const today = new Date();
    dates.push({
      date: new Date(currentDate),
      day: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === today.toDateString(),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
});

const getTasksForDate = (date) => {
  return weddingStore.tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === date.toDateString();
  });
};

const previousMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1
  );
};

const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1
  );
};

const openTaskDetail = (task) => {
  selectedTask.value = task;
};

const handleTaskUpdate = async (taskId, updates) => {
  await weddingStore.updateTask(taskId, updates);
  selectedTask.value = null;
};
</script>
