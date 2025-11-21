// src/components/DeleteBlogModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";
import { useBlogStore } from "../../store/blogStore";
import { useUserStore } from "../../store/userStore";

/**
 * DeleteBlogModal — reads deletingBlog & deleteBlog from userStore.
 * Calls useApi().deleteBlogById(id) to perform server delete (with credentials).
 *
 * Props: none (controlled via userStore)
 */
export default function DeleteBlogModal() {
  const deletingBlog = useUserStore((s) => s.deletingBlog);
  const isOpen = useUserStore((s) => s.deleteBlog);
  const closeDeleteModal = useUserStore((s) => s.closeDeleteModal);

  const deleteBlogById = useApi().deleteBlogById;
  const removeBlogFromStore = useBlogStore((s) => s.removeBlog);
  const fetchBlogs = useApi().fetchBlogs; // in case we want to re-sync on failure

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !deletingBlog) return null;

  const id = deletingBlog._id || deletingBlog.id;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Optimistic UI: remove locally first
      removeBlogFromStore(id);

      // Call hook -> will perform axios delete with withCredentials
      await deleteBlogById(id);

      toast.success("Blog deleted successfully");
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed:", err);
      // rollback by re-fetching (best-effort)
      try {
        await fetchBlogs();
      } catch (e) {
        // ignore
      }
      const message = err?.message || err?.error || (err?.response?.data?.message) || "Delete failed";
      toast.error(`Delete failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 2147483647 }} />
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => { if (!isLoading) closeDeleteModal(); }}
            className="fixed inset-0 bg-zinc-900/30 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden"
          >
            <button
              onClick={() => { if (!isLoading) closeDeleteModal(); }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center shadow-inner">
                  <AlertTriangle size={32} strokeWidth={2} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">Delete this post?</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-[300px] mx-auto">
                    You are about to permanently delete <br />
                    <span className="font-semibold text-zinc-800">"{deletingBlog.title}"</span>.
                  </p>
                  <p className="text-xs text-red-500 font-medium pt-1 bg-red-50/50 py-1 px-2 rounded-md inline-block">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => closeDeleteModal()}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 border border-zinc-200 text-zinc-700 font-medium rounded-xl hover:bg-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-200 focus:outline-none"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </>}
                </button>
              </div>
            </div>

            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-red-400 to-orange-400" />
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
