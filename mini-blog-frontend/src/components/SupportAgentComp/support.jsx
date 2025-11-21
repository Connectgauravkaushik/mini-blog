// src/components/AiSupportAgent.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Share2,
  Link,
  Send,
  Mic,
  Paperclip,
  Globe,
  Sparkles,
  FileText,
  PenTool,
  MessageSquare,
  ChevronDown,
  Image as ImageIcon,
  Zap,
  ArrowRight,
  Settings,
  MoreHorizontal,
  Download,
} from "lucide-react";
import useApi from "../../hooks/useApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AiSupportAgent() {
  const { aiQuery } = useApi();
  const [hasStarted, setHasStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]); // each message: { id, role: 'user'|'assistant'|'loading', content, type? }
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // KB cards (title + desc). Click inserts desc into input.
  const suggestionCards = [
    { icon: FileText, id: "summarize", title: "Create Blog", desc: "How do I create a blog post?" },
    { icon: PenTool, id: "creative", title: "Edit Blog", desc: "Who can edit a blog and how?" },
    { icon: MessageSquare, id: "answer", title: "user Sign Up", desc: "How do I sign up?" }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to append message
  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleSendMessage = async (e) => {
    e?.preventDefault?.();
    const question = inputValue.trim();
    if (!question) return;

    if (!hasStarted) setHasStarted(true);

    // Append user message
    const userMsg = { id: Date.now() + Math.random(), role: "user", content: question };
    pushMessage(userMsg);
    setInputValue("");

    // Append loading indicator message
    const loadingId = Date.now() + Math.random() + 1;
    const loadingMsg = { id: loadingId, role: "loading", content: "Analyzing… please wait..." };
    pushMessage(loadingMsg);

    try {
      // Call the hook's aiQuery — should send to /api/ai/query
      const res = await aiQuery(question);
      // Interpret different response shapes
      let assistantText = "";

      if (!res) {
        assistantText = "No response from server.";
      } else if (typeof res === "string") {
        assistantText = res;
      } else if (res.answer) {
        assistantText = typeof res.answer === "string" ? res.answer : JSON.stringify(res.answer);
      } else if (res.reply) {
        assistantText = typeof res.reply === "string" ? res.reply : JSON.stringify(res.reply);
      } else if (res.message) {
        assistantText = res.message;
      } else if (res.data && (res.data.answer || res.data.reply || res.data.message)) {
        assistantText = res.data.answer || res.data.reply || res.data.message;
      } else if (res.text) {
        assistantText = res.text;
      } else {
        try {
          assistantText = JSON.stringify(res).slice(0, 2000);
        } catch {
          assistantText = String(res);
        }
      }

      // Remove loading message and add assistant response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingId);
        return [
          ...filtered,
          { id: Date.now() + Math.random() + 2, role: "assistant", content: assistantText },
        ];
      });
    } catch (err) {
      // Remove loading and show error assistant bubble + toast
      const errMsg = err?.message || (err?.error && String(err.error)) || "AI query failed";
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      pushMessage({ id: Date.now() + Math.random() + 3, role: "assistant", content: `Error: ${errMsg}` });
      toast.error(`AI query failed: ${errMsg}`);
      console.error("aiQuery error:", err);
    }
  };

  // When a suggestion card is clicked: insert desc into input and focus
  const handleCardClick = (desc) => {
    setInputValue(desc);
    setHasStarted(true);
    // ensure input is focused after state update
    setTimeout(() => inputRef.current?.focus?.(), 0);
  };

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 font-sans overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col relative h-full bg-white">


        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth px-4">
          {!hasStarted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-[85%] max-w-3xl mx-auto">
              {/* Welcome state UI */}
              <div className="bg-orange-50 text-emerald-600 px-5 py-2 rounded-2xl text-sm font-medium border border-emerald-100 mb-10 flex items-center gap-2 cursor-pointer hover:bg-emerald-100 transition">
                <Zap className="w-4 h-4 fill-emerald-600" />
                Upgrade free plan to full access
              </div>

              <div className="mb-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="w-3 h-7 bg-emerald-500 rounded-sm"></div>
                    <div className="w-3 h-4 bg-emerald-400 rounded-sm mt-3"></div>
                    <div className="w-3 h-4 bg-emerald-400 rounded-sm -mt-3"></div>
                    <div className="w-3 h-7 bg-emerald-500 rounded-sm -mt-3"></div>
                  </div>
                </div>
                <h1 className="text-4xl font-medium text-slate-900 tracking-tight">
                  Support<span className="font-semibold">Agent</span>
                </h1>
              </div>

              <div className="w-full bg-white rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-3">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full rounded-2xl px-4 py-4 pb-16 text-slate-700 placeholder-slate-400 focus:outline-none text-lg bg-transparent"
                  />

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"><ImageIcon className="w-5 h-5" /></button>
                      <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"><Zap className="w-5 h-5" /></button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="hidden sm:block p-2 text-gray-400 hover:text-emerald-700 transition"><Globe className="w-5 h-5" /></button>
                      <button type="button" className="hidden sm:block p-2 text-gray-400 hover:text-emerald-700 transition"><Paperclip className="w-5 h-5" /></button>
                      <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 transition"><Mic className="w-5 h-5" /></button>

                      <button type="submit" disabled={!inputValue.trim()} className={`ml-2 p-2.5 rounded-full transition-all duration-300 ${inputValue.trim() ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 hover:bg-emerald-800 hover:scale-105" : "bg-gray-100 text-gray-300"}`}>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Suggestion Grid with title + desc and click-to-insert */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
                {suggestionCards.map((item, i) => (
                  <button
                    key={item.id || i}
                    onClick={() => handleCardClick(item.desc)}
                    className="text-left bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-lg hover:shadow-emerald-700/5 hover:border-emerald-200 cursor-pointer transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
                      <item.icon className="w-5 h-5 text-gray-600 group-hover:text-emerald-700" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>

           
            </motion.div>
          ) : (
            <div className="flex flex-col justify-end min-h-full pb-36 pt-10 max-w-3xl mx-auto">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full mb-8 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "user" ? (
                    <div className="bg-emerald-700 text-white px-6 py-4 rounded-3xl rounded-tr-md shadow-md text-[15px] leading-relaxed max-w-[80%]">
                      {msg.content}
                    </div>
                  ) : msg.role === "loading" ? (
                    <div className="flex items-center gap-4 pl-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm animate-pulse">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-slate-500 text-sm animate-pulse font-medium">{msg.content}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-w-[90%]">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center shadow-md mt-1">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>

                        <div className="bg-white border border-gray-100 px-6 py-5 rounded-3xl rounded-tl-md shadow-sm text-slate-600 text-[15px] leading-7">
                          <p>{msg.content}</p>

                          {msg.type === "analysis" && (
                            <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                  <div className="relative">
                                    <FileText className="w-6 h-6 text-emerald-700" />
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition">Example File</div>
                                  <div className="text-xs text-slate-400 font-medium mt-0.5">Downloads • 500 KB</div>
                                </div>
                              </div>
                              <Download className="w-5 h-5 text-slate-300 group-hover:text-emerald-700 transition" />
                            </div>
                          )}
                        </div>
                      </div>

                      {msg.type === "analysis" && (
                        <div className="pl-14 flex flex-wrap gap-2 mt-2">
                          <button className="text-xs font-medium bg-gray-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-full border border-transparent hover:border-emerald-200 transition-all">Create in-depth analysis</button>
                          <button className="text-xs font-medium bg-gray-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-full border border-transparent hover:border-emerald-200 transition-all">Identify actionable tasks</button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input Area (Floating) */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-6 px-4">
              <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.1)] border border-gray-200 p-2 relative group focus-within:border-emerald-300 transition-all">
                <form onSubmit={handleSendMessage} className="flex flex-col">
                  <div className="flex gap-2 px-2 pb-2">
                    <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-slate-500 font-medium cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">Create in-depth analysis</div>
                    <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-slate-500 font-medium cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">Identify actionable tasks</div>
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask, write or search for anything..."
                    className="w-full px-4 py-2 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent text-sm"
                  />

                  <div className="flex items-center justify-between px-2 pt-2">
                    <div className="flex gap-1">
                      <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition">
                        <Globe className="w-4 h-4" />
                      </button>
                    </div>
                    <button type="submit" disabled={!inputValue.trim()} className={`p-2 rounded-full transition-all duration-200 ${inputValue.trim() ? "bg-black text-white hover:bg-emerald-700 shadow-md" : "bg-gray-100 text-gray-300"}`}>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
