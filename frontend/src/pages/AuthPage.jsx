import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Database, Mail, Lock, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for the verification link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) console.error(error.message);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Database className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            VerbaVault
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? "Create your secure account"
              : "Sign in to access your intelligence engine"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full gap-2 py-6 text-base"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              className="w-full py-6 font-semibold shadow-lg shadow-primary/20"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {isRegistering ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="link"
            className="text-xs"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Log in"
              : "Don't have an account? Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
