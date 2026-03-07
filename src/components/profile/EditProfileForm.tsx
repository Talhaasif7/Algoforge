"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/shared/GlassCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";

interface User {
    name: string;
    avatar: string | null;
    bio: string | null;
}

interface EditProfileFormProps {
    user: User;
    onCancel: () => void;
    token: string;
}

export function EditProfileForm({ user, onCancel, token }: EditProfileFormProps) {
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar || "");
    const [bio, setBio] = useState(user.bio || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, avatar, bio }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Profile updated successfully");
                router.refresh();
                onCancel();
            } else {
                toast.error(data.error?.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred while updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="animate-in fade-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            <X className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={loading}>
                            <Save className="mr-1 h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            className="dark:bg-input/30 border-input w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>
            </form>
        </GlassCard>
    );
}
