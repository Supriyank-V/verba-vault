import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, Sun, Moon, Database, Send } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-secondary border-r transform transition-transform md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 font-bold text-xl mb-8">
            <Database className="text-primary" /> VerbaVault
          </div>
          <nav className="flex-1">
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest mb-4">
              Library
            </p>
            <div className="text-sm opacity-80">No documents uploaded</div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu />
          </Button>

          <div className="font-semibold md:text-lg">Verba Chat</div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
          <div className="max-w-3xl mx-auto text-center mt-20">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-2xl font-bold opacity-80">
              Welcome to VerbaVault
            </h2>
            <p className="opacity-50">
              Upload a PDF to start asking questions.
            </p>
          </div>
        </div>

        {/* Input Footer */}
        <footer className="p-4 md:p-8 border-t bg-background/50 backdrop-blur-md">
          <div className="max-w-3xl mx-auto relative">
            <input
              className="w-full bg-secondary border-none rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Ask anything..."
            />
            <Button className="absolute right-2 top-2 rounded-xl" size="icon">
              <Send size={18} />
            </Button>
          </div>
        </footer>
      </main>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
