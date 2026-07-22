"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in as admin
    const adminToken = localStorage.getItem("admin-authenticated");
    if (adminToken === "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      // Store admin auth state
      localStorage.setItem("admin-authenticated", "true");
      if (data.user) {
        localStorage.setItem("admin-user", JSON.stringify(data.user));
      }

      toast.success("Admin login successful!");
      setTimeout(() => router.push("/admin/dashboard"), 300);
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <Toaster position="top-center" richColors />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-slate-400">Sign in to manage the platform</p>
        </div>

        <div className="rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 px-4 py-3 text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-600/25"
            >
              {isLoading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Student Login →
            </a>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Default: admin@gmail.com / admin123
        </p>
      </div>
    </div>
  );
}

