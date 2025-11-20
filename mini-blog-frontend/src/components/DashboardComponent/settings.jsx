// src/components/DashboardComponent/SettingsModal.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, Mail, Check, Copy } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../../store/userStore"; // same path you used

const overlay = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.18 } },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.12 } },
};
const modal = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20, stiffness: 260 } },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.12 } },
};


const SettingsModal = () => {
  const rawUser = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const showSettings = useUserStore((s) => s.showSettingsModal);
  const setShowSettings = useUserStore((s) => s.settingModal);

  const [copied, setCopied] = useState(false);

  // normalize backend wrapper { NewUser: {...} } or raw user object
  const user = useMemo(() => {
    if (!rawUser) return null;
    return rawUser.NewUser && typeof rawUser.NewUser === "object" ? rawUser.NewUser : rawUser;
  }, [rawUser]);

  const avatarSeed = encodeURIComponent(user?.fullName || user?._id || user?.email || "anon");
  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  const close = () => setShowSettings(false);

  const handleSignOut = () => {
    try {
      logout();
      toast.info("Signed out");
      close();
    } catch (err) {
      toast.error("Sign out failed");
      console.error(err);
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
      <ToastContainer position="top-center" theme="colored" autoClose={1400} hideProgressBar />
      <AnimatePresence>
        {showSettings && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" variants={overlay} initial="hidden" animate="visible" exit="exit" onClick={close}>
            <motion.div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden" variants={modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Settings">
              {/* header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white"><Mail size={16} /></div>
                  <div><div className="text-sm font-semibold text-gray-900">My Profile</div><div className="text-xs text-gray-500">Account</div></div>
                </div>
                <button onClick={close} aria-label="Close" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600">
                  <X size={16} />
                </button>
              </div>

              {/* body */}
              <div className="p-6">
                {!user ? (
                  <div className="py-12 text-center text-gray-400">No user data available.</div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img src={avatarSrc} alt={user.fullName || "User avatar"} className="w-full h-full object-cover" />
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Mail size={14} />
                        <span className="truncate">{user.email}</span>
                        <button onClick={() => copyToClipboard(user.email)} className="ml-2 text-slate-400 hover:text-indigo-600" aria-label="Copy email">
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="w-full mt-4">
                      <button onClick={handleSignOut} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
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
