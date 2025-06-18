<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 px-4"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-dancing font-bold text-pink-600 mb-2">
          💒 Wedding Planner
        </h1>
        <p class="text-gray-600">Rencanakan pernikahan impian Anda</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
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
            placeholder="Password"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>Login</span>
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Belum punya akun?
            <NuxtLink
              to="/register"
              class="text-pink-600 hover:text-pink-700 font-medium"
            >
              Daftar di sini
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
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    await navigateTo("/");
  } else {
    error.value = result.error || "Login gagal";
  }

  loading.value = false;
};
</script>
