import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ChevronLeft, Bot, User } from "lucide-react";
import { toast } from "sonner";

export default function ChatInterface({ chat, onBack, session }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Intelligence node synced. I am ready to analyze ${chat.title}.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://192.168.29.208:8000/chat/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          question: input,
          fileName: chat.title,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error("Backend unreachable");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || data.message,
        },
      ]);
    } catch (error) {
      toast.error("Vector Search Failed", {
        description:
          error.message || "An error occurred while fetching the answer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h2 className="text-lg font-bold leading-none truncate max-w-[200px] md:max-w-md">
            {chat.title}
          </h2>
          <span className="text-[10px] text-primary font-bold tracking-widest uppercase">
            Live RAG Session
          </span>
        </div>
      </div>

      {/* Message Container */}
      <div
        ref={scrollRef}
        className="flex-1 bg-card/40 border-2 border-border/50 rounded-3xl p-4 md:p-6 overflow-y-auto mb-4 backdrop-blur-xl shadow-inner space-y-4 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary border"}`}
              >
                {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-secondary/80 border border-border/50 rounded-tl-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 border border-dashed">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span className="text-xs font-medium animate-pulse">
                Consulting VerbaVault...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative group">
        <input
          autoFocus
          className="w-full bg-card border-2 border-border/50 rounded-2xl py-4 pl-6 pr-16 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-xl"
          placeholder={`Query ${chat.title}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="absolute right-2 top-2 rounded-xl size-10 shadow-lg"
          disabled={!input.trim() || isLoading}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
