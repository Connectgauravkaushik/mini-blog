import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  Underline,
  Link,
  Image as ImageIcon,
  List,
  Quote,
  Save,
  Send,
  Eye,
  Monitor,
  Smartphone,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";
import { useBlogStore } from "../../store/blogStore";
import { useNavigate } from "react-router";

const EditorSection = ({ data, onChange, onPublish, errors, isPublishing }) => {
  const tools = [
    { icon: Heading1, action: "header-1" },
    { icon: Heading2, action: "header-2" },
    { icon: Bold, action: "bold" },
    { icon: Italic, action: "italic" },
    { icon: Underline, action: "underline" },
    { icon: Quote, action: "quote" },
    { icon: List, action: "list" },
    { icon: Link, action: "link" },
    { icon: ImageIcon, action: "image" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white border-r border-gray-100 relative">
      <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1C1C]">
            Write Story
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
            Create new content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          <motion.button
            onClick={onPublish}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isPublishing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transition-colors ${
              isPublishing
                ? "bg-emerald-800/60 text-white cursor-not-allowed"
                : "bg-[#1C1C1C] text-white hover:bg-emerald-900"
            }`}
          >
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
            <Send size={12} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Tagline / Category
            </label>
            <input
              type="text"
              name="tagline"
              value="Blog"
              onChange={onChange}
              placeholder="e.g. Engineering, Design System..."
              className="w-full text-sm font-medium text-gray-700 border-b border-gray-200 py-2 focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-300"
            />
            {errors.tagline && (
              <div className="text-xs text-red-600 mt-1">{errors.tagline}</div>
            )}
          </div>

          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              URL Slug
            </label>
            <div className="flex items-center text-sm text-gray-400 border-b border-gray-200 py-2">
              <span className="mr-1">storyflow.com/blog/</span>
              <input
                type="text"
                name="slug"
                value={data.slug}
                onChange={onChange}
                placeholder="your-post-slug"
                className="flex-1 text-gray-700 focus:outline-none placeholder-gray-300"
              />
            </div>
            {errors.slug && (
              <div className="text-xs text-red-600 mt-1">{errors.slug}</div>
            )}
          </div>

          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Post Title
            </label>
            <textarea
              name="title"
              value={data.title}
              onChange={onChange}
              placeholder="Enter a captivating title..."
              rows={1}
              className="w-full text-4xl font-serif font-bold text-[#1C1C1C] placeholder-gray-200 focus:outline-none resize-none overflow-hidden"
              style={{ minHeight: "60px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              required
            />
            {errors.title && (
              <div className="text-xs text-red-600 mt-1">{errors.title}</div>
            )}
          </div>

          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50/50 border-b border-gray-100 p-2 flex gap-1 flex-wrap">
              {tools.map((tool, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="p-2 rounded hover:bg-white hover:shadow-sm hover:text-emerald-600 text-gray-400 transition-all"
                >
                  <tool.icon size={16} />
                </button>
              ))}
            </div>

            <textarea
              name="content"
              value={data.content}
              onChange={onChange}
              placeholder="Tell your story..."
              className="w-full h-[400px] p-6 text-lg text-gray-600 leading-relaxed focus:outline-none resize-none font-serif"
              required
            />
            {errors.content && (
              <div className="text-xs text-red-600 mt-2 px-6 pb-4">
                {errors.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewSection = ({ data }) => {
  const [device, setDevice] = useState("desktop");
  return (
    <div className="hidden xl:flex w-[40%] h-full bg-[#F3F4F6] border-l border-gray-200 flex-col relative">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F3F4F6]">
        <div className="flex items-center gap-2 text-gray-500">
          <Eye size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Live Preview
          </span>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-lg">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-2 rounded-md transition-all ${
              device === "desktop"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-2 rounded-md transition-all ${
              device === "mobile"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
        <motion.div
          layout
          animate={{
            width: device === "mobile" ? "375px" : "100%",
            scale: device === "mobile" ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`bg-white shadow-xl border border-gray-100 overflow-hidden ${
            device === "mobile"
              ? "rounded-[40px] min-h-[812px]"
              : "rounded-xl min-h-[800px] w-full"
          }`}
        >
          {device === "desktop" && (
            <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300/50" />
              </div>
              <div className="mx-auto px-3 py-0.5 bg-white rounded text-[10px] text-gray-400 font-mono border border-gray-100">
                storyflow.com/blog/{data.slug || "..."}
              </div>
            </div>
          )}

          <div
            className={`bg-white ${
              device === "mobile" ? "px-6 py-8" : "px-12 py-12"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded">
                {data.tagline || "Category"}
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase">
                Oct 24, 2023
              </span>
            </div>

            <h1
              className={`${
                device === "mobile" ? "text-3xl" : "text-5xl"
              } font-serif font-bold text-[#1C1C1C] leading-[1.1] mb-6`}
            >
              {data.title || "Your Title Here"}
            </h1>

            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  className="w-full h-full"
                  alt="avatar"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Gaurav Kaushik
                </p>
                <p className="text-[10px] text-gray-500">Senior Editor</p>
              </div>
            </div>

            <div
              className={`prose prose-slate prose-headings:font-serif prose-p:text-gray-600 prose-a:text-emerald-600 max-w-none font-serif ${
                device === "mobile" ? "prose-sm" : "prose-lg"
              }`}
            >
              {data.content ? (
                data.content.split("\n").map((p, i) => (
                  <p key={i} className={p === "" ? "h-4" : ""}>
                    {p}
                  </p>
                ))
              ) : (
                <div className="space-y-4 opacity-10">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BlogCreator = () => {
  const navigate = useNavigate();
  const { createBlog } = useApi();
  const addBlogToStore = useBlogStore((s) => s.addBlog);
  const [formData, setFormData] = useState({
    tagline: "Blog",
    slug: "what-is-react",
    title: "What is React?",
    content: `Are you curious about React and what it can do for you? Have you been wondering what makes React stand out from the competition?

The importance of React cannot be overstated. React has quickly become a popular choice for frontend web development, and its usage has been steadily increasing since its introduction in 2013.

By reading this article, you will learn what React is and how it can help you create powerful user interfaces.`,
  });

  const [errors, setErrors] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!formData.title || !formData.title.trim())
      next.title = "Title is required";
    if (!formData.content || !formData.content.trim())
      next.content = "Content is required";

    if (!formData.slug || !formData.slug.trim()) next.slug = "Slug is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tagline: formData.tagline,
        slug: formData.slug,
      };

      const created = await createBlog(payload);

      if (created && created._id && addBlogToStore) {
        try {
          addBlogToStore(created);
        } catch {
          console.log(e.err);
        }
      }

      toast.success("Blog published");

      navigate("/dashboard");
    } catch (err) {
      console.error("Publish failed:", err);
      const msg = err?.message || err?.error || "Publish failed";
      toast.error(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] font-sans overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="flex-1 flex relative shadow-2xl overflow-hidden">
        <EditorSection
          data={formData}
          onChange={handleInputChange}
          onPublish={handlePublish}
          errors={errors}
          isPublishing={isPublishing}
        />
        <PreviewSection data={formData} />
      </main>
    </div>
  );
};

export default BlogCreator;
