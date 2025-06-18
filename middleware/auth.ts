export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side
  if (process.server) return;

  const authStore = useAuthStore();

  // Wait for auth to be initialized
  if (authStore.loading) {
    return;
  }

  if (!authStore.user && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login");
  }

  if (authStore.user && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/");
  }
});
