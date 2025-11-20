import { motion } from "framer-motion";
import { Link } from "react-router";

const AllBlogs = () => {
  const posts = Array.from({ length: 6 }).map((_, i) => ({
    title: [
      `Shores and lights — a photo story`,
      `Designing delightful forms`,
      `Packing hacks for minimalists`,
    ][i % 3],
    excerpt:
      "Short excerpt about the post, practical tips and a quick take to entice readers.",
    img: "", // replace with image URL if available
    tag: ["Travel", "Design", "Photography"][i % 3],
    readTime: `${4 + (i % 6)} min read`,
    date: `Mar ${8 + i}`,
  }));

  const recent = posts.slice(0, 4);
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="flex gap-8 items-start">
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Latest articles</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Handpicked stories and practical guides.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((p, idx) => (
                <motion.article
                  key={idx}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 40px rgba(2,6,23,0.08)",
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm transition-transform duration-200"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-emerald-600 font-semibold">
                          {p.tag}
                        </span>
                        <span className="text-xs text-slate-400">
                          {p.date} • {p.readTime}
                        </span>
                      </div>

                      <h3 className="mt-3 font-semibold text-lg leading-tight text-slate-800">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 flex-1">
                        {p.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700">
                            T
                          </div>
                          <div className="text-xs">
                            <div className="font-medium">Tommy Khan</div>
                            <div className="text-slate-400">
                              {p.date} • {p.readTime}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link to="/blog" className="text-sm px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-sm hover:shadow-md transition">
                            Read
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Aside */}
          <aside className="w-80 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Search / CTA */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-sm font-medium">Search articles</div>
                <div className="mt-3 flex gap-2">
                  <input
                    placeholder="Search..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-100 focus:outline-none"
                  />
                  <button className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                    Go
                  </button>
                </div>
              </div>

              {/* Recent posts */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Recent posts</h4>
                  <span className="text-xs text-slate-400">
                    {recent.length}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {recent.map((r, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 6 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium leading-snug hover:text-emerald-700 cursor-pointer">
                          {r.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {r.date} • {r.readTime}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button className="text-sm px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                    View all
                  </button>
                  <a className="text-xs text-slate-400">See popular</a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default AllBlogs;
