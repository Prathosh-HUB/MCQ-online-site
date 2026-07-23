"use client";

import { useTheme } from "@/components/lib/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10" disabled>
        <span className="opacity-0">--</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-lg bg-bg-hover border border-border-default hover:border-border-hover flex items-center justify-center group transition-all"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Sun Icon */}
      <svg
        className={`w-4.5 h-4.5 absolute transition-all duration-300 ${
          theme === "dark" 
            ? "opacity-0 rotate-90 scale-0" 
            : "opacity-100 rotate-0 scale-100 text-amber-500"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon Icon */}
      <svg
        className={`w-4.5 h-4.5 absolute transition-all duration-300 ${
          theme === "dark" 
            ? "opacity-100 rotate-0 scale-100 text-blue-400" 
            : "opacity-0 -rotate-90 scale-0"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
