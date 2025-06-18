import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: Date | null;
  location: string;
  notes: string;
  completed: boolean;
  order: number;
  userId: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
  order: number;
}

export const useWeddingStore = defineStore("wedding", () => {
  const tasks = ref<Task[]>([]);
  const categories = ref<Category[]>([]);
  const weddingDate = ref<Date | null>(null);
  const viewMode = ref<"list" | "grid" | "calendar">("list");

  // Default categories
  const defaultCategories = [
    { name: "Venue & Catering", color: "#EF4444" },
    { name: "Undangan", color: "#F59E0B" },
    { name: "Dekorasi", color: "#10B981" },
    { name: "Fotografi", color: "#3B82F6" },
    { name: "Rias & Busana", color: "#8B5CF6" },
    { name: "Musik & Hiburan", color: "#EC4899" },
    { name: "Transportasi", color: "#6B7280" },
    { name: "Dokumen", color: "#14B8A6" },
  ];

  // Default tasks
  const defaultTasks = [
    {
      title: "Booking gedung resepsi",
      category: "Venue & Catering",
      priority: "urgent" as const,
    },
    {
      title: "Pilih menu catering",
      category: "Venue & Catering",
      priority: "high" as const,
    },
    {
      title: "Design undangan",
      category: "Undangan",
      priority: "high" as const,
    },
    {
      title: "Cetak undangan",
      category: "Undangan",
      priority: "medium" as const,
    },
    {
      title: "Pilih tema dekorasi",
      category: "Dekorasi",
      priority: "medium" as const,
    },
    {
      title: "Booking fotografer",
      category: "Fotografi",
      priority: "high" as const,
    },
    {
      title: "Booking MUA",
      category: "Rias & Busana",
      priority: "high" as const,
    },
    {
      title: "Fitting gaun pengantin",
      category: "Rias & Busana",
      priority: "medium" as const,
    },
  ];

  const { $db } = useNuxtApp();
  const authStore = useAuthStore();

  const initializeData = async () => {
    if (!authStore.user) return;

    // Initialize categories
    for (let i = 0; i < defaultCategories.length; i++) {
      const category = defaultCategories[i];
      await addDoc(collection($db, "categories"), {
        name: category.name,
        color: category.color,
        userId: authStore.user.uid,
        order: i,
        createdAt: Timestamp.now(),
      });
    }

    // Initialize tasks
    for (let i = 0; i < defaultTasks.length; i++) {
      const task = defaultTasks[i];
      await addDoc(collection($db, "tasks"), {
        title: task.title,
        description: "",
        category: task.category,
        priority: task.priority,
        dueDate: null,
        location: "",
        notes: "",
        completed: false,
        order: i,
        userId: authStore.user.uid,
        createdAt: Timestamp.now(),
      });
    }
  };

  const loadCategories = () => {
    if (!authStore.user) return;

    const q = query(
      collection($db, "categories"),
      where("userId", "==", authStore.user.uid),
      orderBy("order")
    );

    onSnapshot(q, (snapshot) => {
      categories.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Category[];
    });
  };

  const loadTasks = () => {
    if (!authStore.user) return;

    const q = query(
      collection($db, "tasks"),
      where("userId", "==", authStore.user.uid),
      orderBy("order")
    );

    onSnapshot(q, (snapshot) => {
      tasks.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate() || null,
        createdAt: doc.data().createdAt?.toDate(),
      })) as Task[];
    });
  };

  const addCategory = async (name: string, color: string) => {
    if (!authStore.user) return;

    await addDoc(collection($db, "categories"), {
      name,
      color,
      userId: authStore.user.uid,
      order: categories.value.length,
      createdAt: Timestamp.now(),
    });
  };

  const addTask = async (taskData: Partial<Task>) => {
    if (!authStore.user) return;

    await addDoc(collection($db, "tasks"), {
      ...taskData,
      userId: authStore.user.uid,
      order: tasks.value.length,
      completed: false,
      dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : null,
      createdAt: Timestamp.now(),
    });
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const taskRef = doc($db, "tasks", taskId);
    const updateData = { ...updates };

    if (updateData.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updateData.dueDate);
    }

    await updateDoc(taskRef, updateData);
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc($db, "tasks", taskId));
  };

  const updateTaskOrder = async (
    taskId: string,
    newOrder: number,
    newCategory?: string
  ) => {
    const updates: any = { order: newOrder };
    if (newCategory) updates.category = newCategory;
    await updateTask(taskId, updates);
  };

  const urgentTasks = computed(() =>
    tasks.value.filter((task) => task.priority === "urgent" && !task.completed)
  );

  const completedTasks = computed(() =>
    tasks.value.filter((task) => task.completed)
  );

  const tasksByCategory = computed(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.value.forEach((task) => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });
    return grouped;
  });

  const daysUntilWedding = computed(() => {
    if (!weddingDate.value) return null;
    const today = new Date();
    const wedding = new Date(weddingDate.value);
    const diffTime = wedding.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });

  const setWeddingDate = (date: Date) => {
    weddingDate.value = date;
  };

  return {
    tasks: readonly(tasks),
    categories: readonly(categories),
    weddingDate,
    viewMode,
    urgentTasks,
    completedTasks,
    tasksByCategory,
    daysUntilWedding,
    initializeData,
    loadCategories,
    loadTasks,
    addCategory,
    addTask,
    updateTask,
    deleteTask,
    updateTaskOrder,
    setWeddingDate,
  };
});
