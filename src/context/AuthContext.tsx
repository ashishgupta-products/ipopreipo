"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserProfileUpdate, WatchlistItem, IPOApplication, InvestorType } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (params: { name: string; email: string; password: string; investorType?: InvestorType }) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (type: "retail" | "hni" | "admin") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: UserProfileUpdate) => Promise<{ success: boolean; error?: string }>;
  
  // Watchlist
  watchlist: WatchlistItem[];
  isWatchlisted: (ipoSlug: string) => boolean;
  toggleWatchlist: (ipoSlug: string, ipoId?: string) => Promise<boolean>;
  refreshWatchlist: () => Promise<void>;

  // Applications
  applications: IPOApplication[];
  addApplication: (app: Omit<IPOApplication, "id" | "userId" | "createdAt">) => Promise<{ success: boolean; error?: string }>;
  removeApplication: (appId: string) => Promise<void>;
  refreshApplications: () => Promise<void>;

  // Modal control
  authModalOpen: boolean;
  authModalView: "login" | "signup" | "forgot";
  openAuthModal: (view?: "login" | "signup" | "forgot") => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [applications, setApplications] = useState<IPOApplication[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup" | "forgot">("login");

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (Array.isArray(data.watchlist)) setWatchlist(data.watchlist);
          if (Array.isArray(data.applications)) setApplications(data.applications);
          return;
        }
      }
      setUser(null);
      setWatchlist([]);
      setApplications([]);
    } catch (err) {
      console.warn("Session check failed:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to sign in" };
      }
      setUser(data.user);
      await Promise.all([refreshWatchlist(), refreshApplications()]);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during login" };
    }
  };

  const signup = async (params: {
    name: string;
    email: string;
    password: string;
    investorType?: InvestorType;
  }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to create account" };
      }
      setUser(data.user);
      setWatchlist([]);
      setApplications([]);
      closeAuthModal();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during registration" };
    }
  };

  const demoLogin = async (type: "retail" | "hni" | "admin") => {
    const demoEmails = {
      retail: "rahul.investor@gmail.com",
      hni: "priya.hni@finance.in",
      admin: "admin@ipopreipo.com",
    };
    return login(demoEmails[type], "Demo@1234");
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setWatchlist([]);
      setApplications([]);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const updateProfile = async (updates: UserProfileUpdate) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to update profile" };
      }
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update profile" };
    }
  };

  const refreshWatchlist = async () => {
    try {
      const res = await fetch("/api/auth/watchlist");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.watchlist)) {
          setWatchlist(data.watchlist);
        }
      }
    } catch (err) {
      console.warn("Failed to refresh watchlist:", err);
    }
  };

  const isWatchlisted = (ipoSlug: string) => {
    return watchlist.some((item) => item.ipoSlug.toLowerCase() === ipoSlug.toLowerCase());
  };

  const toggleWatchlist = async (ipoSlug: string, ipoId?: string): Promise<boolean> => {
    if (!user) {
      openAuthModal("login");
      return false;
    }

    const currentlySaved = isWatchlisted(ipoSlug);

    if (currentlySaved) {
      // Optimistic update
      setWatchlist((prev) => prev.filter((item) => item.ipoSlug !== ipoSlug));
      try {
        await fetch(`/api/auth/watchlist?slug=${encodeURIComponent(ipoSlug)}`, {
          method: "DELETE",
        });
        return false;
      } catch (err) {
        console.error("Failed to remove watchlist item:", err);
        refreshWatchlist();
        return true;
      }
    } else {
      // Add
      const tempItem: WatchlistItem = {
        id: `temp_${Date.now()}`,
        userId: user.id,
        ipoId: ipoId || ipoSlug,
        ipoSlug,
        createdAt: new Date().toISOString(),
      };
      setWatchlist((prev) => [tempItem, ...prev]);

      try {
        const res = await fetch("/api/auth/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ipoSlug, ipoId: ipoId || ipoSlug }),
        });
        if (res.ok) {
          refreshWatchlist();
        }
        return true;
      } catch (err) {
        console.error("Failed to add to watchlist:", err);
        refreshWatchlist();
        return false;
      }
    }
  };

  const refreshApplications = async () => {
    try {
      const res = await fetch("/api/auth/applications");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      }
    } catch (err) {
      console.warn("Failed to refresh applications:", err);
    }
  };

  const addApplication = async (app: Omit<IPOApplication, "id" | "userId" | "createdAt">) => {
    if (!user) {
      openAuthModal("login");
      return { success: false, error: "Please log in to track applications" };
    }

    try {
      const res = await fetch("/api/auth/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(app),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to save application" };
      }
      setApplications((prev) => [data.application, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to record application" };
    }
  };

  const removeApplication = async (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    try {
      await fetch(`/api/auth/applications?id=${encodeURIComponent(appId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete application:", err);
      refreshApplications();
    }
  };

  const openAuthModal = (view: "login" | "signup" | "forgot" = "login") => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        demoLogin,
        logout,
        updateProfile,
        watchlist,
        isWatchlisted,
        toggleWatchlist,
        refreshWatchlist,
        applications,
        addApplication,
        removeApplication,
        refreshApplications,
        authModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
