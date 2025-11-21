// src/components/BlogPost.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowRight, Share2, Bookmark, ChevronRight } from "lucide-react";
import { useBlogStore } from "../../store/blogStore";

/**
 * BlogPost (store-only)
 * - Reads :id from route
 * - Tries props -> authorBlogs -> blogs -> allBlogs for the blog (no API)
 * - Shows related posts from props or store
 * - Auto-scrolls to top on route change and when clicking Read
 * - Read Next shows 3 cards — first card is the current article, then up to 2 related ones
 */

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

const paragraphize = (raw) => {
  if (!raw) return null;
  const paragraphs = String(raw)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p, i) => (
    <p key={i} className="mb-6">
      {p}
    </p>
  ));
};

const BlogPost = ({ blogs: blogsProp } = {}) => {
  const params = useParams();
  const routeIdRaw = params?.id ?? params?.slug ?? null;
  const navigate = useNavigate();

  // Read from all relevant stores
  const authorBlogs = useBlogStore((s) => s.authorBlogs);
  const storeBlogs = useBlogStore((s) => s.blogs);
  const allBlogs = useBlogStore((s) => s.allBlogs);

  const [blog, setBlog] = useState(null);
  const [loadingNav, setLoadingNav] = useState(false);

  // normalize route id for matching: try decodeURIComponent safely
  const routeId = useMemo(() => {
    if (!routeIdRaw) return null;
    try {
      return decodeURIComponent(String(routeIdRaw));
    } catch {
      return String(routeIdRaw);
    }
  }, [routeIdRaw]);

  // find/match helpers
  const matchesId = (b, rid) => {
    if (!b || !rid) return false;
    const ridStr = String(rid).toLowerCase();
    const titleEncoded = b.title ? encodeURIComponent(String(b.title).toLowerCase()) : "";
    const slug = b.slug ? String(b.slug) : "";
    const slugDecoded = (() => {
      try { return decodeURIComponent(slug).toLowerCase(); } catch { return slug.toLowerCase(); }
    })();

    return (
      (b._id && String(b._id).toLowerCase() === ridStr) ||
      (b.id && String(b.id).toLowerCase() === ridStr) ||
      (slug && slug.toLowerCase() === ridStr) ||
      (slugDecoded && slugDecoded === ridStr) ||
      (titleEncoded && titleEncoded === ridStr)
    );
  };

  const findByIdOrSlug = (arr, rid) => {
    if (!Array.isArray(arr) || arr.length === 0 || !rid) return null;
    return arr.find((b) => matchesId(b, rid));
  };

  // locate blog from props or multiple store sources whenever routeId / data changes
  useEffect(() => {
    setBlog(null);

    if (!routeId) return;

    // 1) props
    const fromProp = findByIdOrSlug(blogsProp || [], routeId);
    if (fromProp) {
      setBlog(fromProp);
      return;
    }

    // 2) authorBlogs
    const fromAuthor = findByIdOrSlug(authorBlogs || [], routeId);
    if (fromAuthor) {
      setBlog(fromAuthor);
      return;
    }

    // 3) editable store blogs
    const fromStore = findByIdOrSlug(storeBlogs || [], routeId);
    if (fromStore) {
      setBlog(fromStore);
      return;
    }

    // 4) public allBlogs
    const fromAll = findByIdOrSlug(allBlogs || [], routeId);
    if (fromAll) {
      setBlog(fromAll);
      return;
    }

    // not found — keep null (render not-found)
  }, [routeId, blogsProp, authorBlogs, storeBlogs, allBlogs]);

  // AUTO-SCROLL: whenever routeId changes, scroll to top (smooth)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [routeId]);

  const ui = useMemo(() => {
    if (!blog) return null;
    const title = blog.title || "Untitled";
    const content = blog.content || blog.body || blog.excerpt || "";
    const excerpt = blog.excerpt || content.slice(0, 300);
    const date = formatDate(blog.createdAt || blog.updatedAt || blog.date);
    const authorName =
      (blog.author && (blog.author.fullName || blog.author.name)) || blog.fullName || "Unknown Author";
    const authorRole = blog.author?.role || "Author";
    const readTime = `${Math.max(2, Math.ceil((content.length || 0) / 200))} min read`;
    const slug = blog.slug || blog._id || blog.id;
    return { title, excerpt, date, authorName, authorRole, content, readTime, slug };
  }, [blog]);

  // build related list but ensure 3 cards visible:
  // card #1 = current article (if available), cards #2-3 = other posts
  const related = useMemo(() => {
    // data source preference
    const source = Array.isArray(blogsProp) && blogsProp.length > 0
      ? blogsProp
      : (authorBlogs || storeBlogs || allBlogs || []);

    const uniqueById = (arr) => {
      const seen = new Set();
      return arr.filter((b) => {
        const id = String(b._id || b.id || b.slug || b.title || "");
        if (!id) return false;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    };

    const pool = uniqueById(source);

    const result = [];

    // Add current article first (if exists)
    if (blog) {
      result.push(blog);
    }

    // Fill remaining slots with other posts (exclude current)
    for (let i = 0; i < pool.length && result.length < 3; i += 1) {
      const candidate = pool[i];
      const candId = String(candidate._id || candidate.id || candidate.slug || candidate.title || "");
      const currentId = String(blog?._id || blog?.id || blog?.slug || blog?.title || "");
      if (currentId && candId === currentId) continue;
      result.push(candidate);
    }

    // If still less than 3 (edge cases), try combining other stores to fill
    if (result.length < 3) {
      const extraSources = [authorBlogs, storeBlogs, allBlogs].flat();
      for (let i = 0; i < extraSources.length && result.length < 3; i += 1) {
        const candidate = extraSources[i];
        if (!candidate) continue;
        const candId = String(candidate._id || candidate.id || candidate.slug || candidate.title || "");
        const already = result.some((r) => String(r._id || r.id || r.slug || r.title || "") === candId);
        const currentId = String(blog?._id || blog?.id || blog?.slug || blog?.title || "");
        if (!already && candId !== currentId) result.push(candidate);
      }
    }

    return result.slice(0, 3);
  }, [blogsProp, authorBlogs, storeBlogs, allBlogs, blog]);

  // Compute target route value for a blog object
  const targetRouteFor = (b) => {
    if (!b) return null;
    // prefer slug -> _id -> id -> encoded title
    if (b.slug) return String(b.slug);
    if (b._id) return String(b._id);
    if (b.id) return String(b.id);
    return encodeURIComponent(String(b.title || "").toLowerCase());
  };

  // When clicking related "Read": jump top, show loading overlay, then navigate
  const handleRelatedClick = (e, targetBlog) => {
    e?.preventDefault?.();
    const target = targetRouteFor(targetBlog);
    if (!target) return;

    window.scrollTo({ top: 0, behavior: "auto" });
    setLoadingNav(true);

    // Give browser a tick to paint the overlay
    setTimeout(() => {
      navigate(`/blog/${target}`);
    }, 0);
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* small client-side loading overlay shown when clicking related posts */}


      {/* progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="fixed top-0 left-0 h-1 bg-emerald-600 origin-left z-40 w-full"
      />

      {/* header */}
      <header className="max-w-3xl mx-auto pt-24 pb-12 px-6">
        {!blog ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-semibold mb-4">Article not found</h2>
            <p className="text-sm text-gray-500 mb-6">We couldn't find this article in the client store.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">Go back</button>
              <button onClick={() => navigate("/blogs")} className="px-4 py-2 rounded bg-gray-100">View all</button>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold tracking-widest uppercase text-emerald-700">
              <span className="px-2 py-1 bg-emerald-50 rounded">Article</span>
              <span className="text-gray-300">•</span>
              <span>{ui.date}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.05] text-gray-900">{ui.title}</h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">{ui.excerpt}</p>

            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif font-bold text-xl">
                  {String(ui.authorName || "A").slice(0, 1).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">{ui.authorName}</p>
                  <p className="text-xs text-gray-500">{ui.authorRole}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-emerald-600 transition-colors"><Bookmark size={20} /></button>
                <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-emerald-600 transition-colors"><Share2 size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* article content */}
      {blog && (
        <article className="max-w-3xl mx-auto px-6 pb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold max-w-none">
            {paragraphize(ui.content)}
          </motion.div>
        </article>
      )}

      {/* read next (3 cards: current article first + up to 2 related) */}
      {blog && (
        <section className="bg-slate-50 border-t border-slate-200 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">Read Next</h2>
                <p className="text-gray-500 mt-2">Curated insights for your journey.</p>
              </div>
              <Link to="/blogs" className="hidden md:flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 group">
                View all articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r, idx) => (
                <motion.div
                  key={String(r._id || r.id || r.slug || idx)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`bg-white rounded-2xl p-8 shadow-sm border hover:border-emerald-100 transition ${idx === 0 ? "border-emerald-100" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {idx === 0 ? "Current" : (r.category || "General")}
                      </span>
                      <span className="text-slate-300 text-sm">{Math.max(2, Math.ceil(((r.content||r.body||"").length || 0)/200))} min read</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight font-serif">{r.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{(r.excerpt || (r.content || "").slice(0, 120))}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                          {String((r.author?.fullName || r.fullName || "A")).slice(0,1)}
                        </div>
                        <div className="text-xs text-slate-500">{r.author?.fullName || r.fullName || "Author"}</div>
                      </div>

                      <button
                        onClick={(e) => handleRelatedClick(e, r)}
                        className="text-emerald-600 font-bold flex items-center gap-2"
                      >
                        Read <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="md:hidden w-full mt-8 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-colors" onClick={() => navigate("/blogs")}>
              View all articles
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
