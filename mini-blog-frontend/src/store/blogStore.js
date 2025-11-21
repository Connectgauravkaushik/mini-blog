import { create } from "zustand";

export const useBlogStore = create((set) => ({
  blogs: [],
  loading: false,
  error: null,
  fetched: false,

  allBlogs: [],
  fetchedAll: false,

  authorBlogs: [],
  fetchedAuthor: false,

  setBlogs: (blogs) => set({ blogs }),
  setAllBlogs: (all) => set({ allBlogs: all }),
  setAuthorBlogs: (arr) => set({ authorBlogs: arr }),

  addBlog: (blog) => set((s) => ({ blogs: [blog, ...s.blogs] })),
  addAllBlog: (blog) => set((s) => ({ allBlogs: [blog, ...s.allBlogs] })),
  addAuthorBlog: (blog) =>
    set((s) => ({ authorBlogs: [blog, ...s.authorBlogs] })),

  updateBlog: (id, updates) =>
    set((s) => ({
      blogs: s.blogs.map((b) => (b._id === id ? { ...b, ...updates } : b)),
      authorBlogs: s.authorBlogs.map((b) =>
        b._id === id ? { ...b, ...updates } : b
      ),
    })),

  removeBlog: (id) =>
    set((s) => ({
      blogs: s.blogs.filter((b) => b._id !== id),
      authorBlogs: s.authorBlogs.filter((b) => b._id !== id),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFetched: (fetched = true) => set({ fetched }),
  setFetchedAll: (fetchedAll = true) => set({ fetchedAll }),
  setFetchedAuthor: (fetchedAuthor = true) => set({ fetchedAuthor }),
}));
