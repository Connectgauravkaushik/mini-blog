import { create } from "zustand";

export const useBlogStore = create((set) => ({
  // primary "current" list (keeps legacy behavior) — used for editable lists (author/session)
  blogs: [],
  loading: false,
  error: null,
  fetched: false, // indicates we've fetched 'blogs' successfully

  // dedicated 'allBlogs' collection (public, read-only index for homepage)
  allBlogs: [],
  fetchedAll: false, // indicates we've fetched 'allBlogs' successfully

  // author-specific collection used by fetchAuthorBlogs (editable by the author)
  authorBlogs: [],
  fetchedAuthor: false, // indicates we've fetched authorBlogs successfully

  // set whole lists
  setBlogs: (blogs) => set({ blogs }),
  setAllBlogs: (all) => set({ allBlogs: all }),
  setAuthorBlogs: (arr) => set({ authorBlogs: arr }),

  // add single blog to front
  addBlog: (blog) => set((s) => ({ blogs: [blog, ...s.blogs] })),
  addAllBlog: (blog) => set((s) => ({ allBlogs: [blog, ...s.allBlogs] })),
  addAuthorBlog: (blog) => set((s) => ({ authorBlogs: [blog, ...s.authorBlogs] })),

  // update by _id — update relevant lists (author/editable lists). IMPORTANT: we do NOT update allBlogs here.
  updateBlog: (id, updates) =>
    set((s) => ({
      blogs: s.blogs.map((b) => (b._id === id ? { ...b, ...updates } : b)),
      authorBlogs: s.authorBlogs.map((b) => (b._id === id ? { ...b, ...updates } : b)),
    })),

  // remove by _id (removes from editable lists)
  removeBlog: (id) =>
    set((s) => ({
      blogs: s.blogs.filter((b) => b._id !== id),
      authorBlogs: s.authorBlogs.filter((b) => b._id !== id),
    })),

  // UI flags/state
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFetched: (fetched = true) => set({ fetched }),
  setFetchedAll: (fetchedAll = true) => set({ fetchedAll }),
  setFetchedAuthor: (fetchedAuthor = true) => set({ fetchedAuthor }),
}));
