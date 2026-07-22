"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function CreateStudentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-authenticated");
    if (isAuth !== "true") {
      router.push("/admin/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/create-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Student "${name}" created successfully!`);
        setTimeout(() => router.push("/admin/students"), 1000);
      } else {
        toast.error(data.error || data.message || "Failed to create student");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster position="top-center" richColors />

      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/admin/students"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-white">Create Student</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Min 6 characters"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-6 py-3 rounded-lg text-white font-medium transition-all"
              >
                {isLoading ? "Creating..." : "Create Student"}
              </button>
              <Link
                href="/admin/students"
                className="text-slate-400 hover:text-white px-4 py-3 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

