import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, PenTool, Settings, Search, 
  Edit3, Trash2, MoreVertical, Filter, 
  ChevronRight, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';


// --- COMPONENT 2: BLOG LIST & ACTIONS ---
const BlogList = () => {
  // Mock Data matching your wireframe structure
  const [blogs, setBlogs] = useState([
    { id: 1, title: "The Future of React Server Components", content: "An in-depth look at how RSCs change the rendering paradigm...", status: "Published", date: "Oct 24" },
    { id: 2, title: "Minimalist Design Principles", content: "Why whitespace is the most important element in your UI design...", status: "Draft", date: "Oct 22" },
    { id: 3, title: "Understanding TypeScript Generics", content: "A beginner-friendly guide to mastering generic types in TS...", status: "Published", date: "Sep 15" },
    { id: 4, title: "State Management in 2024", content: "Comparing Redux, Zustand, and Context API for modern apps...", status: "Published", date: "Aug 30" },
    { id: 5, title: "Building Accessible Forms", content: "Essential tips for creating inclusive web forms for all users...", status: "Draft", date: "Aug 12" },
  ]);

  const handleDelete = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] h-full overflow-hidden flex flex-col">
      
      {/* Header Section */}
      <header className="px-8 py-8 md:px-12 pt-12 pb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-serif font-bold text-[#1C1C1C] tracking-tight mb-2">
            Manage Stories
          </h1>
          <p className="text-gray-400 font-medium text-sm">
            View, edit, and manage your publication content.
          </p>
        </motion.div>

        {/* Toolbar: Search & Filter */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by title..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </header>

      {/* Table Header Row */}
      <div className="px-8 md:px-12 pb-2 hidden md:flex items-center text-[10px] font-bold tracking-widest text-gray-400 uppercase select-none">
        <div className="w-[40%] pl-4">Title</div>
        <div className="w-[40%]">Content Preview</div>
        <div className="w-[20%] text-right pr-4">Actions</div>
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 scrollbar-hide">
        <div className="space-y-3">
          <AnimatePresence>
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,1)" }}
                className="group bg-white border border-gray-100 rounded-2xl p-4 md:py-5 md:px-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] hover:border-emerald-500/20 transition-all duration-300 cursor-default"
              >
                
                {/* Column 1: Title & Meta */}
                <div className="w-full md:w-[40%] flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg hidden sm:block ${blog.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 font-serif leading-tight group-hover:text-emerald-900 transition-colors">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${blog.status === 'Published' ? 'text-emerald-600' : 'text-amber-500'}`}>
                         {blog.status === 'Published' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                         {blog.status}
                       </span>
                       <span className="text-gray-300">•</span>
                       <span className="text-xs text-gray-400">{blog.date}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Content Preview */}
                <div className="w-full md:w-[40%]">
                  <p className="text-sm text-gray-500 line-clamp-1 md:line-clamp-1 font-medium">
                    {blog.content}
                  </p>
                </div>

                {/* Column 3: Actions */}
                <div className="w-full md:w-[20%] flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-200">
                    <Edit3 size={14} />
                    <span className="hidden lg:inline">Edit</span>
                  </button>

                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
                  >
                    <Trash2 size={14} />
                    <span className="hidden lg:inline">Delete</span>
                  </button>

                  <button className="p-1.5 text-gray-300 hover:text-gray-600 md:hidden lg:block">
                    <MoreVertical size={16} />
                  </button>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- MAIN LAYOUT WRAPPER ---
const ManageBlogs = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <BlogList />
    </div>
  );
};

export default ManageBlogs;