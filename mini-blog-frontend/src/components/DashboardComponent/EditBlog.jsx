import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Type,
  Link,
  Lock,
  AlignLeft,
  Save,
  Loader2,
  PenLine,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";
import { useBlogStore } from "../../store/blogStore";

const SimpleEditModal = ({ isOpen = false, blog = null, onClose }) => {
  const { updateBlogById } = useApi();
  const updateBlogInStore = useBlogStore((s) => s.updateBlog);
  const setBlogs = useBlogStore((s) => s.setBlogs);

  const [isLoading, setIsLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
  });

  const originalRef = useRef({ title: "", content: "" });

  useEffect(() => {
    setRemoteError(null);
    const title = blog?.title || "";
    const slug = blog?.slug || blog?.slugified || "";
    const content = blog?.content || blog?.body || blog?.excerpt || "";

    setFormData({ title, slug, content });

    originalRef.current = { title, content };
  }, [blog]);

  const handleClose = () => {
    if (isLoading) return;
    onClose?.();
  };

  const isDirty = useMemo(() => {
    if (!blog) return false;
    const orig = originalRef.current;
    return (
      orig.title !== (formData.title || "") ||
      orig.content !== (formData.content || "")
    );
  }, [formData, blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog) return;

    if (!isDirty) return;

    setIsLoading(true);
    setRemoteError(null);

    const id = blog._id || blog.id;
    const payload = {
      title: formData.title,
      content: formData.content,
    };

    const original = { ...(blog || {}) };

    try {
      const optimistic = { ...original, ...payload };
      if (updateBlogInStore) {
        updateBlogInStore(id, optimistic);
      } else {
        setBlogs((prev) => {
          const arr = Array.isArray(prev) ? prev.slice() : [];
          return arr.map((b) => ((b._id || b.id) === id ? optimistic : b));
        });
      }

      const updated = await updateBlogById(id, payload);

      if (updated) {
        if (updateBlogInStore) {
          updateBlogInStore(id, updated);
        } else {
          setBlogs((prev) => {
            const arr = Array.isArray(prev) ? prev.slice() : [];
            return arr.map((b) => ((b._id || b.id) === id ? updated : b));
          });
        }
      }

      toast.success("Blog updated successfully");
      setIsLoading(false);
      onClose?.();
    } catch (err) {
      if (updateBlogInStore) {
        updateBlogInStore(id, original);
      } else {
        setBlogs((prev) => {
          const arr = Array.isArray(prev) ? prev.slice() : [];
          return arr.map((b) => ((b._id || b.id) === id ? original : b));
        });
      }

      console.error("Edit failed:", err);
      const message = err?.message || err?.error || "Update failed";
      setRemoteError(message);
      toast.error(`Update failed: ${message}`);
      setIsLoading(false);
    }
  };

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 2147483647, pointerEvents: "auto" }}
          />

          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
            className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-100 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <PenLine size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 leading-none">
                    Edit Blog Post
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Update your content details below.
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-md hover:bg-zinc-100"
                aria-label="Close editor"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">
                  Post Title
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors">
                    <Type size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter title..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1 flex items-center gap-1">
                  URL Slug{" "}
                  <span className="bg-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-normal border border-zinc-200">
                    Immutable
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Link size={16} />
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock size={14} />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={formData.slug}
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-100/50 border border-dashed border-zinc-200 rounded-xl text-zinc-500 text-sm cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">
                  Content
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-indigo-500 transition-colors">
                    <AlignLeft size={18} />
                  </div>
                  <textarea
                    rows={8}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="Write your blog post content..."
                    required
                  />
                </div>
              </div>

              {remoteError && (
                <div className="text-sm text-red-600">{remoteError}</div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-zinc-400">
                  Last edited: Just now
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-70 ${
                      isLoading
                        ? "bg-zinc-900 text-white"
                        : isDirty
                        ? "bg-zinc-900 hover:bg-black text-white"
                        : "bg-zinc-200 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SimpleEditModal;
