import React, { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { UploadModal } from "@/components/upload-modal";
import ChatInterface from "@/components/chat-interface";
import ProfilePage from "@/pages/ProfilePage";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import {
  User,
  Sun,
  Moon,
  MessageSquare,
  LogOut,
  FileText,
  Clock,
  ArrowRight,
  Database,
} from "lucide-react";

export default function ChatPage({ session }) {
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState("hub");
  const [activeChat, setActiveChat] = useState(null);

  const fullName = session.user.user_metadata?.full_name || "Agent";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  const startChat = (chatData) => {
    setActiveChat(chatData);
    setView("chat");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <header className="border-b bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 font-bold cursor-pointer"
            onClick={() => setView("hub")}
          >
            <Database className="text-primary" size={20} />
            <span>VerbaVault</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <div className="h-4 w-[1px] bg-border mx-1" />
            <Button
              variant="ghost"
              className="gap-2 px-2"
              onClick={() => setView("profile")}
            >
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {fullName[0].toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {fullName}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:text-destructive"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {view === "profile" ? (
          <ProfilePage session={session} onBack={() => setView("hub")} />
        ) : view === "chat" ? (
          <ChatInterface
            chat={activeChat}
            session={session}
            onBack={() => setView("hub")}
          />
        ) : (
          <DashboardHub session={session} onSelectChat={startChat} />
        )}
      </main>
    </div>
  );
}

function DashboardHub({ session, onSelectChat }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vault Explorer</h1>
        <p className="text-muted-foreground">
          Choose a document to begin RAG analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UploadModal session={session} onUploadSuccess={onSelectChat} />

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Recent Chats
          </h3>
          <Card
            className="group hover:border-primary/50 transition-all cursor-pointer bg-card/40"
            onClick={() => onSelectChat({ title: "System_Specs.pdf" })}
          >
            <CardHeader className="p-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-primary" />
                <span className="text-sm font-semibold">System_Specs.pdf</span>
              </div>
              <ArrowRight
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-all"
              />
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Library
          </h3>
          <div className="p-8 border rounded-2xl border-dashed bg-secondary/10 flex items-center justify-center text-xs text-muted-foreground italic">
            Knowledge base synced.
          </div>
        </div>
      </div>
    </div>
  );
}
