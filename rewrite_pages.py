#!/usr/bin/env python3
"""Rewrite the 3 problematic page files with correct JSX structure using direct strings."""

# Use raw strings carefully to avoid escape issues

import os

# ---- Dashboard Page ----
dashboard = '''"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-authenticated");
    if (isAuth !== "true") {
      router.push("/admin/login");
      return;
    }
    const userData = localStorage.getItem("admin-user");
    if (userData) {
      setAdminUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated");
    localStorage.removeItem("admin-user");
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-slate-800 p-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {adminUser && (
            <p className="text-sm text-slate-400 mt-1">Welcome, {adminUser.name}</p>
          )}
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-medium transition-all">Logout</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 max-w-6xl mx-auto">
        <Link href="/admin/students" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">&#x1F464;</div>
          <h2 className="text-xl font-bold">Students</h2>
          <p className="text-slate-400 mt-2">View, Add & Remove Students</p>
        </Link>
        <Link href="/admin/question-set" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">&#x1F4DA;</div>
          <h2 className="text-xl font-bold">Question Sets</h2>
          <p className="text-slate-400 mt-2">Create & Manage Test Sets</p>
        </Link>
        <Link href="/admin/question" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">&#x2753;</div>
          <h2 className="text-xl font-bold">Questions</h2>
          <p className="text-slate-400 mt-2">Add & Edit Questions</p>
        </Link>
        <Link href="/admin/results" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">&#x1F4CA;</div>
          <h2 className="text-xl font-bold">Results</h2>
          <p className="text-slate-400 mt-2">View All Test Results</p>
        </Link>
</div>
  );
}
'''</new_str

with open("src/app/admin/dashboard/page.js", "w", encoding="utf-8", newline="\n") as f:
    f.write(dashboard)
print("Dashboard written:", len(dashboard), "chars")

# ---- Register Page ----
register = '''"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Toaster, toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Weak", cls: "bg-red-500 w-[33%]" };
    if (score <= 3) return { level: 2, label: "Medium", cls: "bg-yellow-500 w-[66%]" };
    return { level: 3, label: "Strong", cls: "bg-green-500 w-[100%]" };
  };

  const pwdStr = getStrength(password);
  const pwdColor = pwdStr.level === 1 ? "text-red-400" : pwdStr.level === 2 ? "text-yellow-400" : "text-green-400";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success("Registration successful!");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/10 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 animate-blob-delayed" />
      </div>
      <Toaster position="top-center" richColors />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-blue-600 mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-slate-400">Join to start taking MCQ tests</p>
        </div>
        <div className="rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Min 6 characters" />
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={"h-1.5 rounded-full transition-all " + pwdStr.cls}></div>
                  <span className={"text-xs font-medium " + pwdColor}>{pwdStr.label}</span>
                </div>
              )}
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 px-4 py-3 text-white font-medium transition-all hover:shadow-lg hover:shadow-emerald-600/25">
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign In</Link>
          </p>
        </div>
    </div>
  );
}
'''

with open("src/app/register/page.js", "w", encoding="utf-8", newline="\n") as f:
    f.write(register)
print("Register written:", len(register), "chars")

# ---- Home Page ----
home = '''"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!loading && user && mounted) router.push("/dashboard");
  }, [user, loading, router, mounted]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 animate-blob-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-float" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-white">MCQ Interview</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all">Get Started</Link>
          </div>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Practice & Prepare for Interviews
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Master Your <span className="text-blue-400">Interview Skills</span>
              <br />
              with MCQ Tests
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Take timed MCQ tests, track your progress, and improve your knowledge across JavaScript, React, and general programming concepts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-2">
                Create Free Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/login" className="px-8 py-3.5 text-base font-medium text-slate-300 border border-slate-600 hover:border-slate-500 rounded-xl transition-all">Sign In</Link>
            </div>
        </main>
        <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-800">
          <p>MCQ Interview - Built with Next.js & Prisma</p>
        </footer>
      </div>
  );
}
'''

with open("src/app/page.js", "w", encoding="utf-8", newline="\n") as f:
    f.write(home)
print("Home written:", len(home), "chars")

print("\nAll 3 files rewritten successfully!")
