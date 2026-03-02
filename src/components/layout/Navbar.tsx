"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
  platformSource: string;
}

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelect = (slug: string) => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    router.push(`/problems/${slug}`);
  };

  const getDiffColor = (diff: string) => {
    if (diff === "EASY") return "text-accent-green";
    if (diff === "MEDIUM") return "text-accent-yellow";
    return "text-red-400";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-bg-secondary/80 px-6 backdrop-blur-md">
      {/* Search */}
      <div className="relative w-full max-w-md" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          placeholder="Search problems..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowResults(true); }}
          className="border-border-subtle bg-bg-tertiary pl-10 text-text-primary placeholder:text-text-muted focus:border-accent-purple"
        />

        {/* Dropdown Results */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/10 bg-[#1a1a2e] shadow-2xl overflow-hidden z-50">
            {isSearching ? (
              <div className="px-4 py-3 text-sm text-text-muted">Searching...</div>
            ) : results.length > 0 ? (
              results.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleSelect(r.slug)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${getDiffColor(r.difficulty)}`}>
                      {r.difficulty.charAt(0)}
                    </span>
                    <span className="text-sm text-text-primary">{r.title}</span>
                  </div>
                  <span className="text-[10px] text-text-muted">{r.platformSource}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-text-muted">No problems found</div>
            )}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
        </Button>
        {user && (
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 rounded-full transition-colors hover:bg-white/5 pr-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg-primary text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
