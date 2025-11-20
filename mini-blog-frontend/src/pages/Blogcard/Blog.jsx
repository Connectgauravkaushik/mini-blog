import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  Share2, 
  Bookmark, 
  ChevronRight,
  Leaf,
  TrendingUp,
  Sun
} from 'lucide-react';

const BlogPost = () => {

  const relatedArticles = [
    {
      category: "Growth",
      title: "High Productivity from Your Home Garden",
      excerpt: "Master the art of small-scale yield optimization with these three essential soil techniques.",
      readTime: "5 min read",
      icon: <Leaf size={20} />
    },
    {
      category: "Strategy",
      title: "The Level Guide to Planting Seeds",
      excerpt: "Timing is everything. Learn the exact seasonal windows for maximum germination rates.",
      readTime: "3 min read",
      icon: <Sun size={20} />
    },
    {
      category: "Finance",
      title: "Calculated Risks in Modern Farming",
      excerpt: "How to balance equipment investment against projected harvest returns in 2024.",
      readTime: "7 min read",
      icon: <TrendingUp size={20} />
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- PROGRESS BAR --- */}
      <motion.div 
        initial={{ scaleX: 0 }} 
        animate={{ scaleX: 1 }} 
        transition={{ duration: 1.5, ease: "circOut" }}
        className="fixed top-0 left-0 h-1 bg-emerald-600 origin-left z-50 w-full"
      />

      {/* --- HEADER --- */}
      <header className="max-w-3xl mx-auto pt-24 pb-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold tracking-widest uppercase text-emerald-700">
            <span className="px-2 py-1 bg-emerald-50 rounded">Agriculture</span>
            <span className="text-gray-300">•</span>
            <span>October 23, 2023</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] text-gray-900">
            Best Strategy to Achieve a <span className="italic text-emerald-800">Profitable Harvest</span>
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
            A comprehensive approach to farm management, selection of appropriate crop varieties, and implementation of efficient practices.
          </p>

          <div className="flex items-center justify-between pt-8 border-t border-gray-100">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif font-bold text-xl">
                   O
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">Odama Studio</p>
                  <p className="text-xs text-gray-500">Agricultural Specialist</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-emerald-600 transition-colors"><Bookmark size={20}/></button>
                <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-emerald-600 transition-colors"><Share2 size={20}/></button>
             </div>
          </div>
        </motion.div>
      </header>

      {/* --- ARTICLE CONTENT --- */}
      <article className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline max-w-none"
        >
          <p className="lead text-2xl font-serif text-gray-700 italic mb-10">
            "Achieving a profitable harvest isn't just about luck; it involves a series of strategic steps starting from the soil up."
          </p>

          <h3>1. Selection of Varieties</h3>
          <p>
            Selecting the right varieties and seeds is a key step in achieving a successful harvest. This includes in-depth research into varieties suited to environmental, climate, and soil conditions. High-quality seeds that can provide optimal results are the foundation of yield.
          </p>
          
          {/* Styled Callout Box */}
          <div className="my-10 bg-slate-50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
            <h4 className="text-emerald-800 font-bold text-sm uppercase tracking-wider mb-2 mt-0">Pro Tip</h4>
            <p className="m-0 text-slate-600 text-base">
              Always test your soil pH before selecting seeds. A variance of 0.5 pH can reduce nutrient absorption by up to 20%.
            </p>
          </div>

          <h3>2. Efficient Crop Management</h3>
          <p>
            Efficient plant management involves regular plant maintenance, application of appropriate fertilizer according to plant needs, effective pest and disease control, and regular monitoring of plant growth and health.
          </p>
          <p>
            By managing crops well, farmers can increase the productivity, quality, and profit of their crops.
          </p>

          <h3>3. Technology Integration</h3>
          <p>
            Utilization of agricultural technology involves the use of various advanced tools and technologies such as soil sensors, automatic irrigation systems, agricultural management software applications, and other technologies that can increase efficiency in agricultural processes.
          </p>
        </motion.div>
      </article>

      {/* --- READ NEXT (3 CARDS) --- */}
      <section className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Read Next</h2>
              <p className="text-gray-500 mt-2">Curated insights for your journey.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 group">
              View all articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((article, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-transparent hover:border-emerald-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden"
              >
                {/* Hover Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                      {article.category}
                    </span>
                    <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                      {article.icon}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-emerald-800 transition-colors font-serif">
                    {article.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                    <Clock size={14} /> {article.readTime}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Read <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="md:hidden w-full mt-8 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-colors">
            View all articles
          </button>
        </div>
      </section>

      {/* --- FOOTER / NEWSLETTER --- */}
      <footer className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Stay updated</h3>
        <p className="text-gray-500 mb-8">Join 5,000+ growers receiving weekly tips.</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input 
            type="email" 
            placeholder="Email address" 
            className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all"
          />
          <button className="bg-gray-900 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Join
          </button>
        </div>
      </footer>

    </div>
  );
};

export default BlogPost;