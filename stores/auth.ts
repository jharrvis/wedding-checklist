import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const initialized = ref(false);

  const login = async (email: string, password: string) => {
    const { $auth } = useNuxtApp();
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      );
      user.value = userCredential.user;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string) => {
    const { $auth } = useNuxtApp();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password
      );
      user.value = userCredential.user;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    const { $auth } = useNuxtApp();
    try {
      await signOut($auth);
      user.value = null;
      await navigateTo("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const initAuth = () => {
    if (initialized.value) return;

    const { $auth } = useNuxtApp();
    initialized.value = true;

    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser;
      loading.value = false;
    });
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    login,
    register,
    logout,
    initAuth,
  };
});
