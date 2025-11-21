import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import useApi from "../../hooks/useApi";
import { useBlogStore } from "../../store/blogStore";

const RECENT_COUNT = 5;

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-5 animate-pulse">
    <div className="h-4 w-1/4 bg-gray-200 rounded mb-3" />
    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="space-y-1">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-2 w-28 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded" />
    </div>
  </div>
);


const formatDate = (raw) => {
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const normalize = (raw) => {
  const id = raw._id || raw.id || Math.random().toString(36).slice(2);
  const title = raw.title || "Untitled";
  const content = (raw.content || raw.body || raw.excerpt || "") + "";
  const excerpt =
    content.length > 200 ? `${content.slice(0, 200).trim()}…` : content;
  const tag = raw.category || (Array.isArray(raw.tags) && raw.tags[0]) || "General";
  const date = formatDate(raw.createdAt || raw.updatedAt || raw.date);
  const readTime =
    raw.readTime ||
    `${Math.max(2, Math.ceil((content.length || 0) / 200))} min read`;
  const authorName = raw.author?.fullName || raw.author?.name || raw.fullName || "Unknown Author";
  const slug = raw.slug || raw.slugified || id;
  const img = raw.coverImage || raw.image || raw.img || "";
  return { id, title, excerpt, tag, date, readTime, authorName, slug, img, raw };
};

const AllBlogs = () => {
  const { fetchBlogs } = useApi();


  const allBlogs = useBlogStore((s) => s.allBlogs);
  const fetchedAll = useBlogStore((s) => s.fetchedAll);
  const loading = useBlogStore((s) => s.loading);
  const apiError = useBlogStore((s) => s.error);
  const setAllBlogs = useBlogStore((s) => s.setAllBlogs);

  useEffect(() => {
    if (fetchedAll) return;

    let mounted = true;
    (async () => {
      try {
       
        const arr = await fetchBlogs({ maxRetries: 3, retryDelayMs: 600, public: true });
        if (!mounted) return;
        if (Array.isArray(arr) && arr.length > 0) {
          setAllBlogs(arr);
        }
      } catch (err) {
        console.error("fetchBlogs (public) failed:", err?.message ?? err);
      }
    })();

    return () => { mounted = false; };

  }, [fetchedAll, fetchBlogs, setAllBlogs]);

  const posts = useMemo(() => {
    return Array.isArray(allBlogs) ? allBlogs.map(normalize) : [];
  }, [allBlogs]);

  const recent = useMemo(() => posts.slice(0, RECENT_COUNT), [posts]);

  const jumpToTop = () => window.scrollTo({ top: 0, behavior: "auto" });

  const showShimmer = loading || (!fetchedAll && posts.length === 0);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
      <div className="flex gap-8 items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-1">Latest articles</h2>
          <p className="text-sm text-slate-500 mb-6">
            Handpicked stories and practical guides.
          </p>

          {showShimmer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {apiError && (
            <div className="text-sm text-red-600 mb-4">
              Error loading posts: {apiError}
            </div>
          )}

          {!showShimmer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((p) => (
                <motion.article
                  key={p.id}
                  whileHover={{ y: -5, boxShadow: "0 20px 30px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-2xl shadow-sm p-5 transition"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-semibold">{p.tag}</span>
                      <span className="text-xs text-slate-400">{p.date} • {p.readTime}</span>
                    </div>

                    <h3 className="mt-3 font-semibold text-lg leading-tight text-slate-800">{p.title}</h3>

                    <p className="mt-2 text-sm text-slate-500 flex-1">{p.excerpt}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700">
                          {String(p.authorName || "A").slice(0, 1).toUpperCase()}
                        </div>
                        <div className="text-xs">
                          <div className="font-medium">{p.authorName}</div>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${p.slug}`}
                        onClick={jumpToTop}
                        className="text-sm px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-sm hover:shadow-md transition"
                      >
                        Read
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        <aside className="w-80 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-sm font-semibold">Recent posts</div>

              <div className="mt-3 space-y-2">
                {recent.map((r) => (
                  <Link
                    key={r.id}
                    to={`/blog/${r.slug}`}
                    onClick={jumpToTop}
                    className="block p-2 rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="text-sm font-medium">{r.title}</div>
                    <div className="text-xs text-slate-400">{r.date}</div>
                  </Link>
                ))}
                {recent.length === 0 && (
                  <div className="text-xs text-slate-400 py-2">No recent posts</div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AllBlogs;
