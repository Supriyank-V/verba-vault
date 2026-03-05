import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, User, ShieldCheck } from "lucide-react";

export default function ProfilePage({ session, onBack }) {
  const { theme, setTheme } = useTheme();
  const user = session.user;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <Button variant="ghost" onClick={onBack} className="mb-8">
        ← Back to Dashboard
      </Button>

      <div className="space-y-8">
        <header className="flex items-center gap-4">
          <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center">
            <User size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user.user_metadata.full_name || "Agent"}
            </h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </header>

        <section className="p-6 bg-secondary/50 rounded-2xl space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" /> System Settings
          </h3>
          <div className="flex items-center justify-between">
            <span>Visual Theme</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
