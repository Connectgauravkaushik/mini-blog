import React from "react";
import { motion } from "framer-motion";
import AllBlogs from "../Blogcard/AllBlogs";
import { Link } from "react-router";

const HeroSection = () => {
  const stagger = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  };

  return (
    <>
      <section className="relative pt-20 pb-24 overflow-hidden mt-10">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-7">
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900"
              >
                Explore the world through my lens —
                <span className="ml-2 bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-emerald-400">
                  stories, travel & design
                </span>
              </motion.h1>

     
              <motion.p
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ delay: 0.06 }}
                className="mt-4 text-slate-600 max-w-xl text-base"
              >
                Real stories. Practical travel guides. Thoughtful design tips —
                meant for creators who want beautiful work and simpler
                adventures.
              </motion.p>

              <motion.div
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ delay: 0.14 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <Link
                  to="/login"
                  href="#create"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
                  aria-label="Create a new blog"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5h6M4 6v12a2 2 0 002 2h12"
                    />
                  </svg>
                  Create blog
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="relative w-full h-full"
              >
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.img
                      whileHover={{ scale: 1.04, rotate: -1 }}
                      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80"
                      alt="travel coast"
                      className="rounded-2xl object-cover h-44 w-full shadow-xl border border-white"
                      loading="lazy"
                    />

                    <motion.img
                      whileHover={{ scale: 1.04, rotate: 1 }}
                      src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80"
                      alt="creative workspace"
                      className="rounded-2xl object-cover h-44 w-full shadow-xl border border-white"
                      loading="lazy"
                    />

                    <motion.img
                      whileHover={{ scale: 1.04, rotate: -0.5 }}
                      src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200&q=80"
                      alt="packing minimal"
                      className="rounded-2xl object-cover h-44 w-full shadow-xl border border-white"
                      loading="lazy"
                    />

                    <motion.div className="relative rounded-2xl overflow-hidden h-44 w-full shadow-xl">
                      <motion.img
                        whileHover={{ scale: 1.03 }}
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0"
                        alt="ocean"
                        className="object-cover h-full w-full"
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 left-3 bg-black/40 text-white px-3 py-1 rounded-md text-xs backdrop-blur-sm">
                        Photo essay
                      </div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36 }}
                    className="absolute -bottom-6 left-4 bg-white/85 border border-slate-100 rounded-2xl px-4 py-3 shadow-lg w-64 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Latest: Shores and lights
                        </div>
                        <div className="text-xs text-slate-500">
                          Quick tips for golden-hour photography
                        </div>
                      </div>
                      <div className="text-xs text-emerald-600 font-semibold">
                        Read
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AllBlogs />
    </>
  );
};

export default HeroSection;
