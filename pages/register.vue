<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 px-4"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-dancing font-bold text-pink-600 mb-2">
          💒 Wedding Planner
        </h1>
        <p class="text-gray-600">Buat akun untuk memulai</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            required
            class="input"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="input"
            placeholder="Minimal 6 karakter"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Tanggal Pernikahan</label
          >
          <input v-model="weddingDate" type="date" class="input" :min="today" />
          <p class="text-xs text-gray-500 mt-1">Opsional - bisa diatur nanti</p>
        </div>

        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <span v-if="loading">Creating Account...</span>
          <span v-else>Daftar</span>
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Sudah punya akun?
            <NuxtLink
              to="/login"
              class="text-pink-600 hover:text-pink-700 font-medium"
            >
              Login di sini
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const weddingStore = useWeddingStore();
const email = ref("");
const password = ref("");
const weddingDate = ref("");
const loading = ref(false);
const error = ref("");

const today = new Date().toISOString().split("T")[0];

const handleRegister = async () => {
  loading.value = true;
  error.value = "";

  const result = await authStore.register(email.value, password.value);

  if (result.success) {
    if (weddingDate.value) {
      weddingStore.setWeddingDate(new Date(weddingDate.value));
    }

    // Initialize default data
    await weddingStore.initializeData();
    await navigateTo("/");
  } else {
    error.value = result.error || "Pendaftaran gagal";
  }

  loading.value = false;
};
</script>
