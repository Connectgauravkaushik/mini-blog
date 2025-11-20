import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Share2, Link, Send, Mic, Paperclip, Globe, 
  Sparkles, FileText, PenTool, MessageSquare, 
  ChevronDown, Image as ImageIcon, Zap, ArrowRight,
  Settings, MoreHorizontal, Download
} from 'lucide-react';

export default function AiSupportAgent() {
  const [hasStarted, setHasStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!hasStarted) setHasStarted(true);

    // User Message
    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    // AI Response Simulation
    setTimeout(() => {
      // Loading State
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'loading', 
        content: 'Analyzing data, please wait...'
      }]);

      // Actual Response
      setTimeout(() => {
        setMessages(prev => {
          const filtered = prev.filter(m => m.role !== 'loading');
          return [...filtered, {
            id: Date.now() + 2,
            role: 'assistant',
            type: 'analysis', // Special type for the blueprint UI
            content: `Based on recent data, the spike in traffic is primarily from increased referrals from Social Media (45%) and Organic Search (35%). Bounce rate on the homepage has dropped by 10% compared to last week.`
          }];
        });
      }, 2000);
    }, 600);
  };

  return (
    <div className="flex h-screen w-full bg-white text-slate-800 font-sans overflow-hidden">
      

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col relative h-full bg-white">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-slate-600">
                <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <span className="text-lg tracking-tight">Cognivo Core v1</span> 
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition">
              <Link className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-full text-sm font-medium shadow-sm hover:border-emerald-200 hover:text-emerald-700 transition">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth px-4">
          
          {!hasStarted ? (
            /* --- WELCOME STATE (Image 1 Blueprint) --- */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-[85%] max-w-3xl mx-auto"
            >
              {/* Upgrade Badge */}
              <div className="bg-orange-50 text-emerald-600 px-5 py-2 rounded-2xl text-sm font-medium border border-emerald-100 mb-10 flex items-center gap-2 cursor-pointer hover:bg-emerald-100 transition">
                <Zap className="w-4 h-4 fill-emerald-600" />
                Upgrade free plan to full access
              </div>

              {/* Logo & Title */}
              <div className="mb-12 text-center">
                 {/* Orange Logo from Blueprint */}
                 <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1.5">
                       <div className="w-3 h-7 bg-emerald-500 rounded-sm"></div>
                       <div className="w-3 h-4 bg-emerald-400 rounded-sm mt-3"></div>
                       <div className="w-3 h-4 bg-emerald-400 rounded-sm -mt-3"></div>
                       <div className="w-3 h-7 bg-emerald-500 rounded-sm -mt-3"></div>
                    </div>
                 </div>
                 <h1 className="text-4xl font-medium text-slate-900 tracking-tight">
                   Let’s start a <span className="font-semibold">smart conversation</span>
                 </h1>
              </div>

              {/* Large Input Box */}
              <div className="w-full bg-white rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-3">
                 <form onSubmit={handleSendMessage} className="relative">
                    <input 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       placeholder="Ask me anything..."
                       className="w-full rounded-2xl px-4 py-4 pb-16 text-slate-700 placeholder-slate-400 focus:outline-none text-lg bg-transparent"
                    />
                    
                    {/* Toolbar */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           {/* Orange Pill Button */}
                           <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-100 hover:bg-emerald-100 transition">
                              <Sparkles className="w-4 h-4" />
                              Deeper Research
                           </button>
                           <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"><ImageIcon className="w-5 h-5"/></button>
                           <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"><Zap className="w-5 h-5"/></button>
                        </div>
                        <div className="flex items-center gap-1">
                           <button type="button" className="hidden sm:block p-2 text-gray-400 hover:text-emerald-700 transition"><Globe className="w-5 h-5"/></button>
                           <button type="button" className="hidden sm:block p-2 text-gray-400 hover:text-emerald-700 transition"><Paperclip className="w-5 h-5"/></button>
                           <button type="button" className="p-2 text-gray-400 hover:text-emerald-700 transition"><Mic className="w-5 h-5"/></button>
                           
                           {/* MAIN ACTION BUTTON: Emerald-700 */}
                           <button 
                              type="submit"
                              disabled={!inputValue.trim()} 
                              className={`ml-2 p-2.5 rounded-full transition-all duration-300 ${
                                inputValue.trim() 
                                ? "bg-emerald-700 text-white shadow-lg shadow-emerald-700/30 hover:bg-emerald-800 hover:scale-105" 
                                : "bg-gray-100 text-gray-300"
                              }`}
                           >
                              <ArrowRight className="w-5 h-5" />
                           </button>
                        </div>
                    </div>
                 </form>
              </div>
              


               {/* Suggestion Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
                  {[
                    {icon: FileText, title: "Summarize Text", desc: "Turn long articles into easy summaries."},
                    {icon: PenTool, title: "Creative Writing", desc: "Generate stories, blog posts, or fresh content ideas."},
                    {icon: MessageSquare, title: "Answer Questions", desc: "Ask me anything—from facts to advice."}
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-lg hover:shadow-emerald-700/5 hover:border-emerald-200 cursor-pointer transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
                            <item.icon className="w-5 h-5 text-gray-600 group-hover:text-emerald-700" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1.5">{item.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
               </div>

               <p className="mt-10 text-[11px] text-gray-400">
                  Cognivo can make mistakes. Check important info. <span className="underline decoration-gray-300 cursor-pointer hover:text-emerald-700 hover:decoration-emerald-700">See Cookie Preferences.</span>
               </p>

            </motion.div>
          ) : (
            /* --- CHAT STATE (Image 2 Blueprint) --- */
            <div className="flex flex-col justify-end min-h-full pb-36 pt-10 max-w-3xl mx-auto">
               {messages.map((msg) => (
                 <motion.div 
                   key={msg.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex w-full mb-8 ${msg.role === 'user' ? "justify-end" : "justify-start"}`}
                 >
                   {msg.role === 'user' ? (
                     /* User Bubble - EMERALD 700 */
                     <div className="bg-emerald-700 text-white px-6 py-4 rounded-3xl rounded-tr-md shadow-md text-[15px] leading-relaxed max-w-[80%]">
                       {msg.content}
                     </div>
                   ) : msg.role === 'loading' ? (
                      /* Loading Pulse */
                      <div className="flex items-center gap-4 pl-4">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm animate-pulse">
                             <Sparkles className="w-4 h-4 text-white" />
                         </div>
                         <span className="text-slate-500 text-sm animate-pulse font-medium">{msg.content}</span>
                      </div>
                   ) : (
                     /* Agent Bubble */
                     <div className="flex flex-col gap-2 max-w-[90%]">
                        <div className="flex items-start gap-4">
                           {/* Bot Avatar */}
                           <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex-shrink-0 flex items-center justify-center shadow-md mt-1">
                               <Sparkles className="w-4 h-4 text-white" />
                           </div>
                           
                           {/* Content Box */}
                           <div className="bg-white border border-gray-100 px-6 py-5 rounded-3xl rounded-tl-md shadow-sm text-slate-600 text-[15px] leading-7">
                              <p>{msg.content}</p>
                              
                              {msg.type === 'analysis' && (
                                 /* File Attachment UI (Image 2 Replica) */
                                 <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                            {/* Simple Icon representation for CSV/File */}
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

                        {/* Suggestion Chips (Below Bot Response) */}
                        {msg.type === 'analysis' && (
                           <div className="pl-14 flex flex-wrap gap-2 mt-2">
                              <button className="text-xs font-medium bg-gray-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-full border border-transparent hover:border-emerald-200 transition-all">
                                Create in-depth analysis
                              </button>
                              <button className="text-xs font-medium bg-gray-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-full border border-transparent hover:border-emerald-200 transition-all">
                                Identify actionable tasks
                              </button>
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
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-6 px-4"
              >
                 <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.1)] border border-gray-200 p-2 relative group focus-within:border-emerald-300 transition-all">
                    <form onSubmit={handleSendMessage} className="flex flex-col">
                        {/* Suggestions (Mock) */}
                       <div className="flex gap-2 px-2 pb-2">
                            <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-slate-500 font-medium cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">Create in-depth analysis</div>
                            <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-slate-500 font-medium cursor-pointer hover:bg-emerald-50 hover:text-emerald-700">Identify actionable tasks</div>
                       </div>

                       <input 
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
                          <button 
                             type="submit"
                             disabled={!inputValue.trim()} 
                             className={`p-2 rounded-full transition-all duration-200 ${
                                inputValue.trim() 
                                ? "bg-black text-white hover:bg-emerald-700 shadow-md" 
                                : "bg-gray-100 text-gray-300"
                             }`}
                          >
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