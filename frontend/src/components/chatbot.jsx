import React, { useState, useRef, useEffect, useCallback } from "react";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageSoundRef = useRef(null);
  const openSoundRef = useRef(null);

  // Scroll auto vers le bas
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus sur l'input quand le chatbot s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 500);
      if (openSoundRef.current) {
        openSoundRef.current.play().catch(e => console.log("Audio error:", e));
      }
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Jouer le son de message
    if (messageSoundRef.current) {
      messageSoundRef.current.play().catch(e => console.log("Audio error:", e));
    }

    const userMessage = { 
      sender: "user", 
      text: trimmedInput, 
      timestamp: new Date(),
      id: Date.now() + Math.random()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      // Simulation d'un délai de frappe pour un effet plus naturel
      setTimeout(() => {
        if (messageSoundRef.current) {
          messageSoundRef.current.play().catch(e => console.log("Audio error:", e));
        }
        
        setMessages((prev) => [...prev, { 
          sender: "bot", 
          text: data.reply || "🤖 No reply received.",
          timestamp: new Date(),
          id: Date.now() + Math.random()
        }]);
        setLoading(false);
        setIsTyping(false);
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        if (messageSoundRef.current) {
          messageSoundRef.current.play().catch(e => console.log("Audio error:", e));
        }
        
        setMessages((prev) => [...prev, { 
          sender: "bot", 
          text: "❌ Error: could not fetch response.",
          timestamp: new Date(),
          id: Date.now() + Math.random()
        }]);
        setLoading(false);
        setIsTyping(false);
      }, 1500);
    }
  };

  // Gestionnaire d'événement pour la touche Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() && !loading) {
      sendMessage();
    }
  };

  // Effacer l'historique de conversation
  const clearChat = () => {
    setMessages([]);
  };

  // Suggestions de messages rapides
  const quickSuggestions = [
    "What can you do?",
    "Tell me a joke",
    "How does this work?",
    "Help me please"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <>
      {/* Sons pour l'expérience */}
      <audio ref={messageSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3" />
      <audio ref={openSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkles-3001.mp3" />
      
      {/* Floating Button avec animation extraordinaire */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white w-20 h-20 rounded-2xl shadow-2xl flex items-center justify-center text-3xl z-50 transition-all duration-500 transform hover:scale-110 hover:rotate-12"
        aria-label="Open chatbot"
        style={{
          boxShadow: "0 10px 30px rgba(168, 85, 247, 0.5), 0 0 0 4px rgba(168, 85, 247, 0.1), 0 0 20px rgba(168, 85, 247, 0.4)"
        }}
      >
        <div className="relative">
          {isOpen ? '✖' : '💬'}
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full"></div>
        </div>
      </button>

      {/* Chat Modal avec animation extraordinaire */}
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-sky-900/30 via-purple-900/40 to-rose-900/30 backdrop-blur-sm flex items-end justify-end z-40 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
      >
        <div 
          className={`bg-gradient-to-b from-slate-50 to-slate-100 w-full max-w-md h-[600px] rounded-3xl shadow-2xl flex flex-col m-4 transform transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} overflow-hidden border-2 border-white/20`}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 -2px 4px 0 rgba(255, 255, 255, 0.2)"
          }}
        >
          {/* Header avec dégradé extraordinaire */}
          <div className="relative p-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold rounded-t-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-rose-400/20"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-3 animate-pulse shadow-lg shadow-green-400/60"></div>
                <span className="text-lg bg-white/10 py-1 px-3 rounded-full backdrop-blur-sm">🤖 MERN AI Assistant</span>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={clearChat}
                  className="text-sm p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:rotate-12 backdrop-blur-sm"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  🗑️
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-xl p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:rotate-90 backdrop-blur-sm"
                  aria-label="Close chatbot"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>

          {/* Chat Area avec fond élégant */}
          <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-br from-slate-100/70 to-slate-200/70 relative">
            {/* Effet de particules subtiles en arrière-plan */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-purple-500 animate-pulse"
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 5 + 3}s`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 relative z-10">
                <div className="text-6xl mb-6 animate-float">🤖</div>
                <h3 className="font-bold text-2xl mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MERN AI Assistant</h3>
                <p className="text-sm mb-6 max-w-xs">Hello! I'm your AI assistant. How can I help you today?</p>
                
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-white/80 border border-slate-200 rounded-xl p-3 text-xs hover:bg-purple-100/50 transition-all duration-300 transform hover:scale-105 text-left break-words shadow-sm hover:shadow-md backdrop-blur-sm"
                      style={{ transition: "all 0.3s" }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`my-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-message-in`}
                style={{ animation: "messageIn 0.4s ease-out" }}
              >
                <div
                  className={`relative max-w-xs break-words rounded-2xl px-4 py-3 shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-md"
                      : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 rounded-bl-md border border-slate-200/50"
                  }`}
                  style={{
                    boxShadow: msg.sender === "user" 
                      ? "0 4px 14px rgba(139, 92, 246, 0.4)" 
                      : "0 4px 14px rgba(0, 0, 0, 0.05)"
                  }}
                >
                  {msg.text}
                  <span className="text-xs opacity-70 block mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {/* Triangle décoratif pour les bulles de message */}
                  <div className={`absolute bottom-0 w-3 h-3 ${
                    msg.sender === "user" 
                      ? "bg-blue-600 right-0 transform translate-x-1/2 rotate-45" 
                      : "bg-slate-100 left-0 transform -translate-x-1/2 rotate-45 border-b border-l border-slate-200/50"
                  }`}></div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="my-4 flex justify-start animate-message-in">
                <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center shadow-lg border border-slate-200/50">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="ml-2 text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area avec style amélioré */}
          <div className="p-4 border-t border-slate-200/50 bg-gradient-to-b from-slate-100 to-slate-200/80">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                className="flex-1 border border-slate-300/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400/50 bg-white/80 backdrop-blur-sm shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={loading}
                style={{
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8)"
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className={`px-5 py-3 rounded-xl text-white transition-all duration-300 transform hover:scale-105 ${
                  !input.trim() || loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                }`}
                style={{
                  boxShadow: !input.trim() || loading ? "none" : "0 4px 14px rgba(139, 92, 246, 0.4)"
                }}
              >
                <span className="flex items-center">
                  <span className="hidden md:inline">Send</span>
                  <span className="md:hidden">➤</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </button>
            </div>
            
            <div className="text-xs text-slate-500/70 mt-3 text-center flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Powered by MERN AI • Secure & Private
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes messageIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-message-in {
          animation: messageIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

export default Chatbot;