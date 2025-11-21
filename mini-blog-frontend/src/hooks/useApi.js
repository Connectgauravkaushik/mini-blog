import axios from "axios";
import { useState, useCallback } from "react";
import { useBlogStore } from "../store/blogStore";
import { BASE_URL } from "../utils/constant";

const API_BASE = BASE_URL || "http://localhost:5000";


const normalizeBlog = (b = {}) => ({ ...b, _id: b._id ?? b.id ?? b._id });
const normalizeBlogs = (arr = []) => arr.map(normalizeBlog);

const authInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default function useApi() {
  const {
    setBlogs,
    setAllBlogs,
    setAuthorBlogs,
    addBlog,
    addAllBlog,
    addAuthorBlog,
    updateBlog,
    removeBlog,
    setLoading,
    setError,
    setFetched,
    setFetchedAll,
    setFetchedAuthor,
  } = useBlogStore();

  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState(null);


  const apiCall = useCallback(async (method, urlOrPath, opts = {}) => {
    const { public: isPublic = false, ...restOpts } = opts;
    const isFull = typeof urlOrPath === "string" && urlOrPath.startsWith("http");
    const config = {
      method,
      url: isFull ? urlOrPath : urlOrPath,
      ...restOpts,
    };

    try {
      const resp = isPublic
        ? await axios({ ...config, baseURL: API_BASE, withCredentials: false })
        : await authInstance(config);
      return { ok: true, data: resp.data, status: resp.status };
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Request failed";
      return { ok: false, error: message, status: err?.response?.status, data: err?.response?.data };
    }
  }, []);

  // --- fetchBlogs
  const fetchBlogs = useCallback(async (opts = {}) => {
    const {
      maxRetries = 3,
      retryDelayMs = 600,
      onProgress,
      public: isPublic = true,
    } = opts;

    setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);

    let attempt = 0;
    let lastErr = null;

    while (attempt <= maxRetries) {
      if (typeof onProgress === "function") {
        try { onProgress({ attempt }); } catch { }
      }

      const res = await apiCall("get", "/api/blogs", { public: !!isPublic });

      if (res.ok) {
        const data = res.data;
        const arr = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : (data?.blogs ?? []);
        const normalized = normalizeBlogs(arr);

    x)
  setAllBlogs(normalized);
  setFetchedAll(true);

  setLocalLoading(false); setLoading(false); setError(null); setLocalError(null);

  return normalized;
}

lastErr = res.error || "Failed to fetch blogs";
attempt += 1;
if (attempt > maxRetries) break;

const backoff = Math.round(retryDelayMs * Math.pow(1.5, attempt) + Math.random() * 200);

await new Promise((r) => setTimeout(r, backoff));
    }

const msg = lastErr || "Failed to fetch blogs after retries";
setLocalLoading(false); setLocalError(msg); setLoading(false); setError(msg);
throw new Error(msg);
  }, [apiCall, setAllBlogs, setFetchedAll, setLoading, setError]);

// --- fetchAuthorBlogs 
const fetchAuthorBlogs = useCallback(async (options = {}) => {
  const { authorId = null, url = null, onSuccess = null, maxRetries = 3, retryDelayMs = 600 } = options;

  setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);

  const endpoint = url || (authorId ? `/api/blogs/author/${authorId}` : `/api/blogs/author`);
  let attempt = 0;
  let lastErr = null;

  while (attempt <= maxRetries) {
    const res = await apiCall("get", endpoint, { public: false });

    if (res.ok) {
      const data = res.data;
      const arr = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : (data?.blogs ?? []);
      const normalized = normalizeBlogs(arr);

      // write to author-specific state only
      setAuthorBlogs(normalized);
      setFetchedAuthor(true);

      setLocalLoading(false); setLoading(false); setError(null); setLocalError(null);

      if (typeof onSuccess === "function") {
        try { onSuccess(normalized); } catch (e) { console.warn("onSuccess threw:", e); }
      }

      return normalized;
    }

    lastErr = res.error || "Failed to fetch author blogs";
    attempt += 1;
    if (attempt > maxRetries) break;

    const backoff = Math.round(retryDelayMs * Math.pow(1.5, attempt) + Math.random() * 150);

    await new Promise((r) => setTimeout(r, backoff));
  }

  const msg = lastErr || "Failed to fetch author blogs after retries";
  setLocalLoading(false); setLocalError(msg); setLoading(false); setError(msg);
  throw new Error(msg);
}, [apiCall, setAuthorBlogs, setFetchedAuthor, setLoading, setError]);

// --- createBlog 
const createBlog = useCallback(async ({ title, content }) => {
  setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);
  const res = await apiCall("post", "/api/blogs", { data: { title, content }, public: false });
  setLocalLoading(false); setLoading(false);

  if (!res.ok) {
    const msg = res.error || "Failed to create blog";
    setLocalError(msg); setError(msg);
    throw new Error(msg);
  }

  const blogRaw = res.data?.blog ?? res.data;
  if (blogRaw) {
    const norm = normalizeBlog(blogRaw);

    addBlog(norm);
    addAuthorBlog(norm);

  }
  return blogRaw;
}, [apiCall, addBlog, addAuthorBlog, setLoading, setError]);

// --- update
const updateBlogById = useCallback(async (id, updates) => {
  setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);
  const res = await apiCall("put", `/api/blogs/edit/${id}`, { data: updates, public: false });
  setLocalLoading(false); setLoading(false);

  if (!res.ok) {
    const msg = res.error || "Failed to update blog";
    setLocalError(msg); setError(msg);
    throw new Error(msg);
  }

  const blogRaw = res.data?.blog ?? res.data;
  if (blogRaw) updateBlog(id, normalizeBlog(blogRaw));
  return blogRaw;
}, [apiCall, updateBlog, setLoading, setError]);

// --- delete
const deleteBlogById = useCallback(async (id) => {
  setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);
  const res = await apiCall("delete", `/api/blogs/delete/${id}`, { public: false });
  setLocalLoading(false); setLoading(false);

  if (!res.ok) {
    const msg = res.error || "Failed to delete blog";
    setLocalError(msg); setError(msg);
    throw new Error(msg);
  }

  if (res.data?.success) removeBlog(id);
  return true;
}, [apiCall, removeBlog, setLoading, setError]);


const aiQuery = useCallback(async (question) => {
  setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);
  const res = await apiCall("post", "/api/ai/query", { data: { question }, public: false });
  setLocalLoading(false); setLoading(false);

  if (!res.ok) {
    const msg = res.error || "AI query failed";
    setLocalError(msg); setError(msg);
    throw new Error(msg);
  }
  return res.data;
}, [apiCall, setLoading, setError]);

const fetchDynamic = useCallback(async (urlOrPath, opts = {}) => {
  setLocalLoading(true); setLocalError(null); setLoading(true); setError(null);
  const method = (opts.method || "get").toLowerCase();
  const res = await apiCall(method, urlOrPath, opts);
  setLocalLoading(false); setLoading(false);

  if (!res.ok) {
    const msg = res.error || "Dynamic fetch failed";
    setLocalError(msg); setError(msg);
    throw new Error(msg);
  }
  return res.data;
}, [apiCall, setLoading, setError]);

return {
  loading,
  error,
  fetchBlogs,
  fetchAuthorBlogs,
  fetchDynamic,
  createBlog,
  updateBlogById,
  deleteBlogById,
  aiQuery,
};

