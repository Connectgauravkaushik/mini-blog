// src/store/userStore.js
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

/**
 * User store (auth + simple UI flags).
 * Added delete modal state: deleteBlog (boolean) and deletingBlog (object)
 */
export const useUserStore = create((set, get) => ({
  // state
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // UI state
  showSettingsModal: false,
  showEditingModal: false,
  editingBlog: null,
  deleteBlog: false,
  deletingBlog: null, // blog object being considered for deletion

  // actions
  setUser: (user) =>
    set({ user, isAuthenticated: !!user, loading: false, error: null }),

  clearUser: () =>
    set({ user: null, isAuthenticated: false, loading: false, error: null }),

  setLoading: (v) => set({ loading: v }),

  setError: (err) => set({ error: err }),

  // login: expects backend to set cookie (withCredentials: true)
  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const user = res.data?.user ?? res.data;
      set({ user, isAuthenticated: true, loading: false, error: null });
      return user;
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  // register (signup)
  register: async ({ fullName, email, password }) => {
    set({ loading: true, error: null });
    try {
      const payload = { email, password };
      if (fullName) payload.fullName = fullName;

      const res = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        payload,
        { withCredentials: true }
      );

      const returned = res.data;
      const user = returned?.user ?? returned;

      set({ user, isAuthenticated: !!user, loading: false, error: null });
      return returned;
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      set({ error: message, loading: false });
      throw err;
    }
  },

  // local logout (client-side); call backend endpoint if you need server-side cookie clear
  logout: async (callServer = false) => {
    if (callServer) {
      try {
        await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      } catch (e) {
        // ignore server logout errors
      }
    }
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  // modal helpers
  setSettingsModal: (showSettings) => {
    set({ showSettingsModal: !!showSettings });
  },

  // editing modal: open/close and set editing blog
  openEditingModal: (blog) => {
    set({ editingBlog: blog ?? null, showEditingModal: true });
  },

  closeEditingModal: () => {
    set({ editingBlog: null, showEditingModal: false });
  },

  // delete modal: open/close and set deleting blog
  openDeleteModal: (blog) => {
    set({ deletingBlog: blog ?? null, deleteBlog: true });
  },

  closeDeleteModal: () => {
    set({ deletingBlog: null, deleteBlog: false });
  },

  // convenience setter if you need to update editingBlog fields locally
  setEditingBlog: (partial) =>
    set((state) => ({
      editingBlog: { ...(state.editingBlog || {}), ...(partial || {}) },
    })),
}));
