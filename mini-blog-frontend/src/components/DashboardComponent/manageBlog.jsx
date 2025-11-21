import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Edit3,
  Trash2,
  MoreVertical,
  Filter,
  FileText,
  CheckCircle2,
  Circle,
  CalendarDays,
} from "lucide-react";
import { useBlogStore } from "../../store/blogStore";
import { useUserStore } from "../../store/userStore";
import SimpleEditModal from "./EditBlog";
import DeleteBlogModal from "./DeleteBlog";

const SkeletonRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center">
    <div className="col-span-12 md:col-span-6 pr-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-slate-300 w-6 h-6 rounded bg-slate-200" />
        <div className="min-w-0">
          <div className="h-4 w-44 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-64 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
    <div className="col-span-6 md:col-span-2">
      <div className="h-6 w-20 bg-slate-100 rounded" />
    </div>
    <div className="col-span-6 md:col-span-2">
      <div className="h-4 w-28 bg-slate-100 rounded" />
    </div>
    <div className="col-span-12 md:col-span-2 flex justify-end">
      <div className="h-8 w-28 bg-slate-100 rounded" />
    </div>
  </div>
);

const ManageBlogs = () => {
  const authorBlogs = useBlogStore((s) => s.authorBlogs);

  const fallbackBlogs = useBlogStore((s) => s.blogs);

  // user store modal helpers
  const openEditingModal = useUserStore((s) => s.openEditingModal);
  const closeEditingModal = useUserStore((s) => s.closeEditingModal);
  const showEditingModal = useUserStore((s) => s.showEditingModal);
  const editingBlog = useUserStore((s) => s.editingBlog);
  const openDeleteModal = useUserStore((s) => s.openDeleteModal);

  const source =
    Array.isArray(authorBlogs) && authorBlogs.length > 0
      ? authorBlogs
      : fallbackBlogs || [];

  const normalized = useMemo(() => {
    return (source || []).map((raw) => {
      const id =
        raw._id || raw.id || String(raw._uuid || raw.tempId || Math.random());
      const title = raw.title || raw.name || "Untitled";
      const content = raw.content || raw.body || raw.excerpt || "";
      const status =
        raw.status && String(raw.status).toLowerCase() === "draft"
          ? "Draft"
          : raw.published === false
          ? "Draft"
          : "Published";
      const dateRaw = raw.updatedAt || raw.createdAt || raw.date || null;
      const date = dateRaw
        ? new Date(dateRaw).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—";
      return { id, title, content, status, date, raw };
    });
  }, [source]);

  const handleOpenDelete = (raw) => {
    openDeleteModal(raw);
  };

  const empty = !Array.isArray(normalized) || normalized.length === 0;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-600 font-sans flex flex-col">
      <header className="px-6 py-8 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Content Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your publication's posts and drafts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search stories..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-10 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="col-span-6">Title & Excerpt</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {empty ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center"
                  >
                    <p className="text-slate-400 text-sm">No stories found.</p>
                  </motion.div>
                ) : (
                  normalized.map((blog) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors duration-200"
                    >
                      <div className="col-span-12 md:col-span-6 pr-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-slate-300">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0">
                            <h3
                              onClick={() => openEditingModal(blog.raw)}
                              className="text-sm font-bold text-slate-900 cursor-pointer group-hover:text-emerald-700 transition-colors duration-200"
                            >
                              {blog.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 truncate font-medium max-w-md">
                              {blog.content || "No content preview available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            blog.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {blog.status === "Published" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <Circle size={8} fill="currentColor" />
                          )}
                          {blog.status}
                        </span>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center text-xs text-slate-400 font-medium">
                        <CalendarDays size={14} className="mr-2 opacity-70" />
                        {blog.date}
                      </div>

                      <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-1">
                        <div className="flex items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => openEditingModal(blog.raw)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(blog.raw)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <button className="md:hidden text-slate-300">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showEditingModal && editingBlog && (
          <SimpleEditModal
            isOpen={showEditingModal}
            blog={editingBlog}
            onClose={() => closeEditingModal()}
          />
        )}
      </AnimatePresence>
      <DeleteBlogModal />
    </div>
  );
};

export default ManageBlogs;
