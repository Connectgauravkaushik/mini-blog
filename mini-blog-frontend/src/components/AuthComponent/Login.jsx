// src/components/AuthComponent/Login.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, User, Eye, EyeOff, Feather } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useUserStore((s) => s.login);
  const register = useUserStore((s) => s.register);
  const loading = useUserStore((s) => s.loading);

  const navigate = useNavigate();

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("Welcome back! 🚀");

        setTimeout(() => navigate("/dashboard"), 900);
      } else {
        await register({ fullName, email, password });
        toast.success("Account created! Logging you in… ✨");

        setTimeout(() => navigate("/dashboard"), 900);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  const fadeVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F4F6] flex items-center justify-center p-4 font-sans">
      <ToastContainer position="top-center" theme="colored" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-[1200px] min-h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 relative flex flex-col justify-center">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-emerald-800">
            <div className="bg-emerald-800 text-white p-1.5 rounded-lg">
              <Feather size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Blogjar</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md mx-auto mt-10 md:mt-0"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {isLogin ? "Welcome Back!" : "Join the Community"}
              </h1>

              <p className="text-gray-500 mb-8">
                {isLogin
                  ? "Sign in to continue."
                  : "Create an account to start writing."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl"
                        required={!isLogin}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                    loading
                      ? "bg-emerald-600/70"
                      : "bg-emerald-900 hover:bg-emerald-800"
                  }`}
                >
                  {loading
                    ? isLogin
                      ? "Signing in..."
                      : "Creating account..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </motion.button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={toggleMode}
                    className="font-bold text-emerald-700 hover:text-emerald-900"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE MARKETING — unchanged */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0F3838] to-[#062525] relative flex-col justify-between p-16 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 mt-10">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Curate Your <br />
              <span className="text-emerald-400">Ideas & Stories</span>
            </h2>
            <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed">
              Join a community of over 10,000 writers and readers. Share your
              perspectives, discover new voices, and grow your audience.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 mt-12">
            <div className="text-emerald-400 text-4xl font-serif mb-2 leading-none">
              “
            </div>
            <p className="text-lg font-medium leading-relaxed mb-4">
              StoryFlow has completely transformed how I publish my content. The
              editor is intuitive, and the community engagement is incredible.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-emerald-400"
              />
              <div>
                <h4 className="font-bold text-white">Sarah Jenkins</h4>
                <p className="text-sm text-emerald-200">Editor at TechDaily</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
