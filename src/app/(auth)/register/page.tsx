"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/shared/GlassCard";
import { GradientText } from "@/components/shared/GradientText";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || "Registration failed");
        return;
      }
      toast.success("Account created! Please check your email to verify.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <GlassCard className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Join <GradientText>AlgoForge</GradientText>
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Create your account and start building skills
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-text-secondary">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              id="name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border-border-subtle bg-bg-tertiary pl-10 text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-text-secondary">
            Username
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">@</span>
            <Input
              id="username"
              placeholder="johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="border-border-subtle bg-bg-tertiary pl-8 text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-secondary">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border-border-subtle bg-bg-tertiary pl-10 text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-secondary">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border-border-subtle bg-bg-tertiary pl-10 pr-10 text-text-primary placeholder:text-text-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full gradient-bg-primary text-white hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" className="text-white" /> : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-purple hover:underline">
          Log in
        </Link>
      </div>
    </GlassCard>
  );
}
