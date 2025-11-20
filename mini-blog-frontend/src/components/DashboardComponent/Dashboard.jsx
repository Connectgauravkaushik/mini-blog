import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  PenTool, 
  Settings, 
  LogOut, 
  Sparkles, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit3, 
  BarChart2,
  Calendar,
  AlignLeft
} from 'lucide-react';

const Dashboard = () => {
  // Mock Data for Blog Posts
  const [posts] = useState([
    {
      id: 1,
      title: "The Future of Minimalist Design",
      excerpt: "Exploring how whitespace impacts user retention in 2024.",
      status: "Published",
      views: "1.2k",
      date: "Oct 24, 2023",
      category: "Design"
    },
    {
      id: 2,
      title: "AI in Content Creation",
      excerpt: "How to leverage LLMs without losing your authentic voice.",
      status: "Draft",
      views: "-",
      date: "Last edited 2h ago",
      category: "Tech"
    },
    {
      id: 3,
      title: "Sustainable Living Guide",
      excerpt: "Practical tips for reducing your carbon footprint at home.",
      status: "Published",
      views: "854",
      date: "Oct 20, 2023",
      category: "Lifestyle"
    },
    {
      id: 4,
      title: "Understanding React Hooks",
      excerpt: "A deep dive into useEffect and useMemo for beginners.",
      status: "Published",
      views: "3.4k",
      date: "Sep 15, 2023",
      category: "Code"
    },
    {
      id: 5,
      title: "Remote Work Culture",
      excerpt: "Building team cohesion when everyone is miles apart.",
      status: "Draft",
      views: "-",
      date: "Last edited 1d ago",
      category: "Work"
    },
    {
      id: 6,
      title: "Photography Essentials",
      excerpt: "Mastering the exposure triangle for better shots.",
      status: "Published",
      views: "542",
      date: "Aug 30, 2023",
      category: "Art"
    }
  ]);

  // Sidebar Item Component
  const NavItem = ({ icon: Icon, active = false }) => (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`p-3 rounded-xl cursor-pointer transition-colors mb-4 ${
        active 
          ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]' 
          : 'text-gray-400 hover:text-emerald-300 hover:bg-white/5'
      }`}
    >
      <Icon size={22} strokeWidth={2} />
    </motion.div>
  );

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] font-sans text-slate-800 overflow-hidden">
      


      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Gradient Decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10 pointer-events-none" />

        {/* HEADER */}
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
            {/* AI Assistant Button */}
            <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-emerald-100 text-emerald-700 font-semibold hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all">
              <Sparkles size={18} className="text-emerald-500 group-hover:animate-pulse" />
              <span>AI Assistant</span>
            </button>

            {/* Create Blog Button */}
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F3838] text-white font-semibold hover:bg-emerald-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Plus size={20} />
              <span>Create Blog</span>
            </button>
          </motion.div>
        </header>

        {/* CONTENT SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto px-8 pb-12 md:px-12">
          
          {/* Filters / Search Bar Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="flex gap-2 text-sm font-medium text-gray-500">
               <button className="px-3 py-1.5 rounded-md text-emerald-700 bg-emerald-50">All</button>
               <button className="px-3 py-1.5 rounded-md hover:bg-gray-100">Published</button>
               <button className="px-3 py-1.5 rounded-md hover:bg-gray-100">Drafts</button>
            </div>
          </div>

          {/* BLOG CARDS GRID */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-emerald-100/50 transition-all duration-300 group flex flex-col h-64"
              >
                {/* Card Header: Status & Options */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    post.status === 'Published' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.status}
                  </span>
                  <button className="text-gray-300 hover:text-gray-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="flex-1">
                  <div className="text-xs text-gray-400 font-medium mb-1">{post.category}</div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-800 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer: Stats & Action */}
                <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {post.date}
                    </div>
                    {post.status === 'Published' && (
                       <div className="flex items-center gap-1 text-emerald-600/70">
                         <Eye size={14} /> {post.views}
                       </div>
                    )}
                  </div>
                  
                  <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2 text-xs font-bold">
                    {/* Matches the "Read" button location in wireframe */}
                    <Edit3 size={14} /> 
                    <span>Edit</span>
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Placeholder Card (Optional visual cue) */}
            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.02 }}
              className="h-64 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 transition-all gap-3"
            >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Plus size={24} />
                </div>
                <span className="font-semibold">Create New Post</span>
            </motion.button>

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;