import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  PenTool,
  Settings,
  User,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Link,
  Image as ImageIcon,
  List,
  AlignLeft,
  Type,
  Heading1,
  Heading2,
  Quote,
  MoreHorizontal,
  Save,
  Send,
  Eye,
  Monitor,
  Smartphone,
} from "lucide-react";

// --- COMPONENT 1: THE EDITOR (Middle Section) ---
const EditorSection = ({ data, onChange, onPublish }) => {
  // Mock Toolbar Buttons
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
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1C1C]">
            Write Story
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
            Create new content
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            <Save size={14} />
            <span>Save Draft</span>
          </button>
          <motion.button
            onClick={onPublish}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1C1C1C] text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-900/20"
          >
            <span>Publish</span>
            <Send size={12} />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Tagline / Category */}
          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">
              Tagline / Category
            </label>
            <input
              type="text"
              name="tagline"
              value={data.tagline}
              onChange={onChange}
              placeholder="e.g. Engineering, Design System..."
              className="w-full text-sm font-medium text-gray-700 border-b border-gray-200 py-2 focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-300"
            />
          </div>

          {/* Slug Input */}
          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">
              URL Slug
            </label>
            <div className="flex items-center text-sm text-gray-400 border-b border-gray-200 py-2 focus-within:border-emerald-500 transition-all">
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
          </div>

          {/* Title Input */}
          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">
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
            />
          </div>

          {/* Rich Text Editor Container */}
          <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm group focus-within:ring-1 focus-within:ring-emerald-500/30 focus-within:border-emerald-400 transition-all">
            {/* Toolbar */}
            <div className="bg-gray-50/50 border-b border-gray-100 p-2 flex gap-1 flex-wrap">
              {tools.map((tool, idx) => (
                <button
                  key={idx}
                  className="p-2 rounded hover:bg-white hover:shadow-sm hover:text-emerald-600 text-gray-400 transition-all"
                >
                  <tool.icon size={16} />
                </button>
              ))}
            </div>

            {/* Content Textarea */}
            <textarea
              name="content"
              value={data.content}
              onChange={onChange}
              placeholder="Tell your story..."
              className="w-full h-[400px] p-6 text-lg text-gray-600 leading-relaxed focus:outline-none resize-none font-serif"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. PREVIEW SECTION (Right) ---
const PreviewSection = ({ data }) => {
  const [device, setDevice] = useState("desktop"); // 'desktop' | 'mobile'

  return (
    <div className="hidden xl:flex w-[40%] h-full bg-[#F3F4F6] border-l border-gray-200 flex-col relative">
      {/* Preview Header / Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F3F4F6]">
        <div className="flex items-center gap-2 text-gray-500">
          <Eye size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Live Preview
          </span>
        </div>

        {/* Device Toggles */}
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

      {/* Preview Canvas */}
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
          {/* Simulated Browser Header (Desktop Only) */}
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

          {/* Simulated Phone Notch (Mobile Only) */}
          {device === "mobile" && (
            <div className="h-7 bg-white w-full flex justify-center items-end pb-1 relative z-20">
              <div className="w-24 h-4 bg-black/90 rounded-full absolute top-0"></div>
            </div>
          )}

          {/* ACTUAL CONTENT PREVIEW */}
          <div
            className={`bg-white ${
              device === "mobile" ? "px-6 py-8" : "px-12 py-12"
            }`}
          >
            {/* Date & Tag */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded">
                {data.tagline || "Category"}
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase">
                Oct 24, 2023
              </span>
            </div>

            {/* Title */}
            <h1
              className={`${
                device === "mobile" ? "text-3xl" : "text-5xl"
              } font-serif font-bold text-[#1C1C1C] leading-[1.1] mb-6`}
            >
              {data.title || "Your Title Here"}
            </h1>

            {/* Author Block */}
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

            {/* Body Text */}
            <div
              className={`prose prose-slate prose-headings:font-serif prose-p:text-gray-600 prose-a:text-emerald-600 max-w-none font-serif ${
                device === "mobile" ? "prose-sm" : "prose-lg"
              }`}
            >
              {data.content ? (
                data.content.split("\n").map((paragraph, index) => (
                  <p key={index} className={paragraph === "" ? "h-4" : ""}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="space-y-4 opacity-10">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
// --- MAIN PAGE: BLOG CREATOR LAYOUT ---
const BlogCreator = () => {
  const [formData, setFormData] = useState({
    tagline: "Technology",
    slug: "what-is-react",
    title: "What is React?",
    content: `Are you curious about React and what it can do for you? Have you been wondering what makes React stand out from the competition?

The importance of React cannot be overstated. React has quickly become a popular choice for frontend web development, and its usage has been steadily increasing since its introduction in 2013.

By reading this article, you will learn what React is and how it can help you create powerful user interfaces.`,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] font-sans overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* 2. MAIN CANVAS (Split View) */}
      <main className="flex-1 flex relative shadow-2xl overflow-hidden">
        {/* Left Half: Editor */}
        <EditorSection
          data={formData}
          onChange={handleInputChange}
          onPublish={() => alert("Published!")}
        />

        {/* Right Half: Preview */}
        <PreviewSection data={formData} />
      </main>
    </div>
  );
};

export default BlogCreator;
