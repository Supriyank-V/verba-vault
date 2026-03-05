import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthPage from "@/pages/AuthPage";
import ChatPage from "@/pages/ChatPage";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return session ? <ChatPage session={session} /> : <AuthPage />;
}
