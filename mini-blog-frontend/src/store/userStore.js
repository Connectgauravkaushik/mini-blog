import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

import { useBlogStore } from "./blogStore";

export const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  showSettingsModal: false,
  showEditingModal: false,
  editingBlog: null,
  deleteBlog: false,
  deletingBlog: null,

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

  register: async ({ fullName, email, password }) => {
    set({ loading: true, error: null });
    try {
      const payload = { email, password };
      if (fullName) payload.fullName = fullName;

      const res = await axios.post(`${BASE_URL}/api/auth/signup`, payload, {
        withCredentials: true,
      });

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

  logout: async (callServer = false) => {
    try {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        showSettingsModal: false,
        showEditingModal: false,
        editingBlog: null,
        deleteBlog: false,
        deletingBlog: null,
      });

      useBlogStore.setState({
        authorBlogs: [],
        blogs: [],
        fetchedAuthor: false,
        fetched: false,
      });

      try {
        const PREFIX = "author_blogs_cache";
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          const k = localStorage.key(i);
          if (!k) continue;
          if (k.startsWith(PREFIX)) toRemove.push(k);
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
      } catch (e) {
        console.log(e.err);
      }
    } catch (e) {
      console.log(e.err);
    }

    if (callServer) {
      try {
        await axios.post(
          `${BASE_URL}/api/auth/logout`,
          {},
          { withCredentials: true }
        );
      } catch (e) {
        console.log(e.err);
      }
    }
  },

  // modal helpers
  setSettingsModal: (showSettings) => {
    set({ showSettingsModal: !!showSettings });
  },

  openEditingModal: (blog) => {
    set({ editingBlog: blog ?? null, showEditingModal: true });
  },

  closeEditingModal: () => {
    set({ editingBlog: null, showEditingModal: false });
  },

  openDeleteModal: (blog) => {
    set({ deletingBlog: blog ?? null, deleteBlog: true });
  },

  closeDeleteModal: () => {
    set({ deletingBlog: null, deleteBlog: false });
  },

  setEditingBlog: (partial) =>
    set((state) => ({
      editingBlog: { ...(state.editingBlog || {}), ...(partial || {}) },
    })),
}));
