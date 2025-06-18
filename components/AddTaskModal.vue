<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Tambah Task Baru</h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Suggested Tasks by Category -->
      <div
        v-if="form.category && getSuggestedTasks(form.category).length > 0"
        class="p-6 border-b bg-gray-50"
      >
        <h4 class="text-sm font-medium text-gray-700 mb-3">
          Saran Task untuk {{ form.category }}:
        </h4>
        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="suggestion in getSuggestedTasks(form.category)"
            :key="suggestion"
            @click="useSuggestedTask(suggestion)"
            class="text-left p-2 text-sm bg-white border border-gray-200 rounded hover:border-pink-300 hover:bg-pink-50 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Judul Task</label
          >
          <input
            v-model="form.title"
            type="text"
            required
            class="input"
            placeholder="Contoh: Booking venue"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Deskripsi</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            class="input"
            placeholder="Detail task (opsional)"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Kategori</label
          >
          <select v-model="form.category" required class="input">
            <option value="">Pilih kategori</option>
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
          <input
            v-model="form.location"
            type="text"
            class="input"
            placeholder="Contoh: Hotel Grand Indonesia"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Catatan</label
          >
          <textarea
            v-model="form.notes"
            rows="2"
            class="input"
            placeholder="Catatan tambahan (opsional)"
          ></textarea>
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
            <span v-else>Simpan Task</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["close"]);
const weddingStore = useWeddingStore();

const form = reactive({
  title: "",
  description: "",
  category: "",
  priority: "medium",
  dueDate: "",
  location: "",
  notes: "",
});

const loading = ref(false);

// Suggested tasks by category
const suggestedTasks = {
  "Venue & Catering": [
    "Booking gedung resepsi",
    "Survey lokasi venue",
    "Pilih menu catering",
    "Cicipi menu catering",
    "Nego harga paket venue",
    "Konfirmasi kapasitas tamu",
    "Cek fasilitas venue",
  ],
  Undangan: [
    "Design undangan",
    "Cetak undangan",
    "Buat daftar tamu",
    "Kirim undangan",
    "Konfirm kehadiran tamu",
    "Design save the date",
    "Cetak amplop undangan",
  ],
  Dekorasi: [
    "Pilih tema dekorasi",
    "Booking dekorator",
    "Pilih bunga",
    "Setup dekorasi venue",
    "Persiapan backdrop",
    "Sewa kursi dan meja",
    "Pilih lighting",
  ],
  Fotografi: [
    "Booking fotografer",
    "Booking videographer",
    "Pre-wedding photoshoot",
    "Brief photographer",
    "Siapkan props foto",
    "Pilih album foto",
    "Video highlight",
  ],
  "Rias & Busana": [
    "Booking MUA",
    "Fitting gaun pengantin",
    "Pilih kebaya",
    "Trial makeup",
    "Sewa jas pengantin",
    "Aksesoris pengantin",
    "Sepatu pengantin",
  ],
  "Musik & Hiburan": [
    "Booking band/DJ",
    "Pilih playlist musik",
    "Sound system",
    "MC/pembawa acara",
    "Hiburan tambahan",
    "Rehearsal musik",
  ],
  Transportasi: [
    "Sewa mobil pengantin",
    "Transport tamu VIP",
    "Parkir venue",
    "Ojek online untuk tamu",
    "Shuttle bus",
  ],
  Dokumen: [
    "Surat nikah",
    "KUA/gereja booking",
    "Akta kelahiran",
    "KTP terbaru",
    "Surat keterangan belum menikah",
    "Premarital counseling",
  ],
};

const getSuggestedTasks = (category) => {
  return suggestedTasks[category] || [];
};

const useSuggestedTask = (title) => {
  form.title = title;
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    await weddingStore.addTask({
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate) : null,
      location: form.location,
      notes: form.notes,
    });

    emit("close");
  } catch (error) {
    console.error("Error adding task:", error);
  } finally {
    loading.value = false;
  }
};
</script>
