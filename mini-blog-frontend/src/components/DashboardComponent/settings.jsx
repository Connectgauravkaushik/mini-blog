// src/components/DashboardComponent/SettingsModal.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Mail, Check, Copy, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router";

const overlay = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(4px)",
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.15 },
  },
};

const modal = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } },
};

const SettingsModal = () => {
  const rawUser = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const showSettings = useUserStore((s) => s.showSettingsModal);
  const setShowSettings = useUserStore((s) => s.setSettingsModal);

  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  // normalize backend wrapper { NewUser: {...} } or raw user object
  const user = useMemo(() => {
    if (!rawUser) return null;
    return rawUser.NewUser && typeof rawUser.NewUser === "object"
      ? rawUser.NewUser
      : rawUser;
  }, [rawUser]);

  const avatarSeed = encodeURIComponent(
    user?.fullName || user?._id || user?.email || "anon"
  );
  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  const close = () => setShowSettings(false);

  const handleSignOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // call server-side logout; store.logout will also clear local user state
      await logout(true);
      toast.info("Signed out");
      close();
      // redirect to login page
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Sign out failed:", err);
      toast.error("Sign out failed");
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Email copied");
      setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={1400}
        hideProgressBar
      />
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20"
            variants={overlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
          >
            <motion.div
              className="bg-white w-full max-w-[360px] rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden relative"
              variants={modal}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Settings"
            >
              {/* Close Button - Absolute positioning for cleaner header */}
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="p-8 pt-10">
                {!user ? (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Loading profile...
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Avatar Section */}
                    <div className="relative mb-5">
                      <div className="w-24 h-24 rounded-full bg-slate-50 ring-4 ring-white shadow-sm overflow-hidden">
                        <img
                          src={avatarSrc}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-emerald-500 w-5 h-5 border-4 border-white rounded-full"></div>
                    </div>

                    {/* User Info */}
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
                      {user.fullName}
                    </h2>

                    {/* Interactive Email Pill */}
                    <button
                      onClick={() => copyToClipboard(user.email)}
                      className="group flex items-center gap-2 px-4 py-1.5 mt-1 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 text-sm font-medium"
                    >
                      <Mail
                        size={14}
                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                      />
                      <span className="truncate max-w-[180px]">
                        {user.email}
                      </span>
                      <span className="text-slate-300 group-hover:text-indigo-500 transition-colors ml-1">
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="w-full h-px bg-slate-100 my-8" />

                    {/* Actions */}
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600">
                            <User size={16} />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Role
                            </p>
                            <p className="text-sm text-slate-500 font-medium">
                              Author
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        disabled={busy}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          busy
                            ? "bg-slate-100 text-slate-400 cursor-wait"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 shadow-sm hover:shadow-none"
                        }`}
                      >
                        <LogOut size={16} />
                        {busy ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>

                    <p className="mt-6 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                      Account Settings
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsModal;
