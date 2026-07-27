"use client";

import React, { useState, useEffect } from "react";
import { X, Smartphone, ArrowDownToLine } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches 
      || (window.navigator as any).standalone;

    if (isStandalone) {
      return;
    }

    // Check if dismissed in this browser session
    const isDismissed = localStorage.getItem("ipopreipo_install_dismissed") === "true";
    if (isDismissed) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // If iOS, we show the banner unconditionally (since Safari doesn't support beforeinstallprompt)
    if (ios) {
      setIsVisible(true);
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can install
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert("To install: Tap Safari's Share button (square icon with upward arrow) and select 'Add to Home Screen'.");
      return;
    }

    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Discard stashed event
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("ipopreipo_install_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2.5 flex items-center justify-between shadow-md border-b border-blue-800 text-xs relative z-[10001] animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4 text-blue-300" />
        </div>
        <p className="font-semibold leading-tight pr-4">
          📱 Install <strong className="text-white">IPOPreIPO App</strong> for live GMP alerts!
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleInstallClick}
          className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[11px] shadow-sm whitespace-nowrap active:scale-95"
        >
          <ArrowDownToLine className="w-3.5 h-3.5" />
          Add to Home Screen
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
