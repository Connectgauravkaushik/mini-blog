import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit3,
  Calendar,
} from "lucide-react";
import useApi from "../../hooks/useApi";
import { useBlogStore } from "../../store/blogStore";
import { useUserStore } from "../../store/userStore";
import EditBlogModal from "./EditBlog";
import { Link } from "react-router";

const CACHE_PREFIX = "author_blogs_cache";
const MAX_CACHE_ITEMS = 100;

const SkeletonCard = () => (
  <div className="group bg-white border border-gray-100 rounded-2xl p-4 md:py-5 md:px-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm animate-pulse">
    <div className="w-full md:w-[40%] flex items-center gap-4">
      <div
        className="p-2.5 rounded-lg hidden sm:block bg-gray-200"
        style={{ width: 40, height: 40 }}
      />
      <div className="w-full">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/5" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
    <div className="w-full md:w-[40%]">
      <div className="h-4 bg-gray-200 rounded w-full" />
    </div>
    <div className="w-full md:w-[20%] flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-8 w-8 bg-gray-200 rounded" />
    </div>
  </div>
);

const Dashboard = () => {
  const {
    fetchAuthorBlogs,
    loading: apiLoading,
    error: apiError,
    cancelLast,
  } = useApi();

  const authorBlogs = useBlogStore((s) => s.authorBlogs);
  const fetchedAuthor = useBlogStore((s) => s.fetchedAuthor);
  const setAuthorBlogs = useBlogStore((s) => s.setAuthorBlogs);
  const setFetchedAuthor = useBlogStore((s) => s.setFetchedAuthor);

  const setLoading = useBlogStore((s) => s.setLoading);
  const setError = useBlogStore((s) => s.setError);

  const user = useUserStore((s) => s.user);

  const cacheKey = `${CACHE_PREFIX}_${user?._id ?? "anon"}`;

  useEffect(() => {
    if (!user) {
      try {
        setAuthorBlogs([]);
        setFetchedAuthor(false);
        setLoading(false);
        setError(null);

        try {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (k && k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
          }
        } catch (e) {
          console.log(e.err);
        }
      } catch (e) {
        console.log(e.err);
      }
    }
  }, [user?.id, user?._id, user]);

  useEffect(() => {
    if (fetchedAuthor && Array.isArray(authorBlogs) && authorBlogs.length > 0)
      return;

    try {
      setAuthorBlogs([]);
      setLoading(true);
      setError(null);
    } catch (e) {
      console.log(e.err);
    }

    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const cached = JSON.parse(raw);
        if (Array.isArray(cached) && cached.length > 0) {
          setAuthorBlogs(cached);
        }
      }
    } catch (e) {
      console.log(e.err);
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        await fetchAuthorBlogs({
          onSuccess: (arr) => {
            if (!mounted) return;
            const normalizedArr = Array.isArray(arr) ? arr : [];
            setAuthorBlogs(normalizedArr);
            setFetchedAuthor(true);
            setLoading(false);

            try {
              const toCache = Array.isArray(normalizedArr)
                ? normalizedArr.slice(0, MAX_CACHE_ITEMS)
                : [];
              localStorage.setItem(cacheKey, JSON.stringify(toCache));
            } catch (e) {
              console.log(e.err);
            }
          },
        });
      } catch (err) {
        if (!mounted) return;
        setLoading(false);
        const msg = err?.message || "Failed to fetch author blogs";
        setError(msg);
        console.error("Failed to fetch author blogs:", err);
      }
    }

    load();

    return () => {
      mounted = false;
      try {
        if (typeof cancelLast === "function") cancelLast();
      } catch (e) {
        console.log(e.err);
      }
    };
  }, [user?._id, cacheKey, fetchAuthorBlogs, setAuthorBlogs, setFetchedAuthor]);


  const normalized = useMemo(() => {
    return (authorBlogs || []).map((blog) => {
      const id = blog._id || blog.id || Math.random().toString(36).slice(2);
      const title = blog.title || "Untitled";
      const content = blog.content || blog.body || blog.excerpt || "";
      const excerpt =
        (blog.excerpt && String(blog.excerpt)) ||
        content.slice(0, 160) ||
        "No description";
      const status =
        blog.status && String(blog.status).toLowerCase() === "draft"
          ? "Draft"
          : blog.published === false
          ? "Draft"
          : "Published";
      const views =
        typeof blog.views !== "undefined" ? String(blog.views) : "-";
      const rawDate = blog.updatedAt || blog.createdAt || blog.date || null;
      const date = rawDate ? new Date(rawDate).toLocaleDateString() : "—";
      const category =
        blog.category || (blog.tags && blog.tags[0]) || "General";
      return { id, title, excerpt, status, views, date, category };
    });
  }, [authorBlogs]);

  return (
    <>
      <div className="flex h-screen w-full bg-[#F9FAFB] font-sans text-slate-800 overflow-hidden">
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10 pointer-events-none" />

          <header className="px-8 py-8 md:px-12 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-1">
                Your Stories
              </h1>
              <p className="text-gray-500">
                Manage your blog posts and analyze performance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/dashboard/support"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-emerald-100 text-emerald-700 font-semibold hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all"
              >
                <Sparkles
                  size={18}
                  className="text-emerald-500 group-hover:animate-pulse"
                />
                <span>AI Assistant</span>
              </Link>

              <Link
                to="/dashboard/create-blog"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F3838] text-white font-semibold hover:bg-emerald-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Plus size={20} />
                <span>Create Blog</span>
              </Link>
            </motion.div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 pb-12 md:px-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="relative w-full sm:w-96">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="flex gap-2 text-sm font-medium text-gray-500">
                <button className="px-3 py-1.5 rounded-md text-emerald-700 bg-emerald-50">
                  All
                </button>
              </div>
            </div>

            {apiLoading && normalized.length === 0 && (
              <div className="mb-6 text-sm text-gray-500">Loading posts…</div>
            )}
            {apiError && (
              <div className="mb-6 text-sm text-red-600">
                Error fetching posts: {apiError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalized.length === 0 && apiLoading && (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              )}

              {normalized.length === 0 && !apiLoading && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No posts yet. Click “Create Blog” to add your first post.
                </div>
              )}

              {normalized.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-emerald-100/50 transition-all duration-200 group flex flex-col h-64"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        post.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                    <button className="text-gray-300 hover:text-gray-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-gray-400 font-medium mb-1">
                      {post.category}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-800 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} /> {post.date}
                      </div>
                      {post.status === "Published" && (
                        <div className="flex items-center gap-1 text-emerald-600/70">
                          <Eye size={14} /> {post.views}
                        </div>
                      )}
                    </div>

                    <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2 text-xs font-bold">
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <EditBlogModal />
    </>
  );
};

export default Dashboard;
