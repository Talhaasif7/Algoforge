"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

export function AuthInitializer() {
    const setUser = useAuthStore((s) => s.setUser);
    const setLoading = useAuthStore((s) => s.setLoading);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                // We don't need to pass the token manually if we use cookies
                // The middleware and API should handle the accessToken cookie
                const res = await axios.get("/api/auth/me");
                if (res.data.success && res.data.data.user) {
                    setUser(res.data.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setUser, setLoading]);

    return null;
}
