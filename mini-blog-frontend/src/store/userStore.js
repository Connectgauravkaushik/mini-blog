// src/stores/userStore.js
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";


export const useUserStore = create((set, get) => ({
  // state
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  showSettingsModal:false,

  // actions
  setUser: (user) =>
    set({ user, isAuthenticated: !!user, loading: false, error: null }),
  clearUser: () =>
    set({ user: null, isAuthenticated: false, loading: false, error: null }),
  setLoading: (v) => set({ loading: v }),
  setError: (err) => set({ error: err }),

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const user = res.data?.user ?? res.data;

      set({ user, isAuthenticated: true, loading: false });
      return user;
    } catch (err) {
      set({
        error: err?.response?.data?.message || err?.message || "Login failed",
        loading: false,
      });
      throw err;
    }
  },
  register: async ({ fullName, email, password }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        { fullName, email, password },
        { withCredentials: true }
      );
      const returned = res.data;
      const user = returned?.user ?? returned;

      set({ user, isAuthenticated: !!user, loading: false, error: null });

      return returned;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  settingModal:(showSettings)=> {
    set({showSettingsModal:showSettings})
  }
}));

export default useUserStore;
