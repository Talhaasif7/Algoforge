import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-bg-secondary/80 px-6 backdrop-blur-md">
      {/* User Info section (Left) */}
      <div className="flex items-center gap-4">

        {/* User Pill (Left) */}
        {user && (
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 transition-all pl-1 pr-3 py-1 group"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-bg-primary text-[10px] font-bold text-white group-hover:ring-2 ring-accent-purple/30 transition-all overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              {user.name}
            </span>
          </button>
        )}
      </div>

      {/* Right section (Notifications) */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
