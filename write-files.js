const fs = require("fs");
const path = require("path");

const files = {};

// page.js - Landing page with hero
files["src/app/page.js"] = `
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user && mounted) {
      router.push("/dashboard");
    }
  }, [user, loading, router, mounted]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-blob-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-float"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-text-primary">MCQ Interview</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-all hover-glow">Get Started</Link>
          </div>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-bg border border-accent/20 text-accent text-sm font-medium mb-8 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow"></span>
              Practice &amp; Prepare for Interviews
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6 animate-fade-in-up">
              Master Your <span className="text-gradient">Interview Skills</span>
              <br />
              with MCQ Tests
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              Take timed MCQ tests, track your progress, and improve your knowledge across JavaScript, React, and general programming concepts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <Link href="/register" className="px-8 py-3.5 text-base font-medium text-white bg-accent hover:bg-accent-hover rounded-xl transition-all hover-glow flex items-center gap-2">
                Create Free Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/login" className="px-8 py-3.5 text-base font-medium text-text-secondary border border-border-default hover:border-border-hover rounded-xl transition-all">Sign In</Link>
            </div>
        </main>
        <footer className="py-6 text-center text-sm text-text-muted border-t border-border-default">
          <p>MCQ Interview - Built with Next.js &amp; Prisma</p>
        </footer>
      </div>
  );
}
`.trim();

// Login page
files["src/app/login/page.js"] = `
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      setTimeout(() => router.push(redirect), 500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-500/5 animate-blob-delayed"></div>
      <Toaster position="top-center" richColors />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-brand mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="mt-1 text-text-secondary">Sign in to continue your tests</p>
        </div>
        <div className="rounded-2xl bg-bg-card border border-border-default p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="floating-label-group">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
              <label htmlFor="email">Email</label>
            </div>
            <div className="floating-label-group">
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " required />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-accent hover:bg-accent-hover disabled:bg-accent/50 px-4 py-3 text-white font-medium transition-all hover-glow">
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Don\\'t have an account?{" "}
            <Link href="/register" className="text-accent hover:text-accent-hover font-medium">Register</Link>
          </p>
        </div>
    </div>
  );
}
`.trim();

// Register page
files["src/app/register/page.js"] = `
"use client";

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

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Weak", className: "password-strength-weak" };
    if (score <= 3) return { level: 2, label: "Medium", className: "password-strength-medium" };
    return { level: 3, label: "Strong", className: "password-strength-strong" };
  };

  const pwdStrength = getPasswordStrength(password);

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
    <div className="relative min-h-screen bg-bg-primary overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-blob-delayed"></div>
      <Toaster position="top-center" richColors />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-brand mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="mt-1 text-text-secondary">Join to start taking MCQ tests</p>
        </div>
        <div className="rounded-2xl bg-bg-card border border-border-default p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="floating-label-group">
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder=" " required />
              <label htmlFor="name">Full Name</label>
            </div>
            <div className="floating-label-group">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
              <label htmlFor="email">Email</label>
            </div>
            <div>
              <div className="floating-label-group">
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " minLength={6} required />
                <label htmlFor="password">Password</label>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className={"password-strength-bar " + pwdStrength.className}></div>
                    <span className={"text-xs font-medium " + (pwdStrength.level === 1 ? "text-danger-text" : pwdStrength.level === 2 ? "text-warning-text" : "text-success-text")}>{pwdStrength.label}</span>
                  </div>
              )}
            </div>
            <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-accent hover:bg-accent-hover disabled:bg-accent/50 px-4 py-3 text-white font-medium transition-all hover-glow">
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover font-medium">Sign In</Link>
          </p>
        </div>
    </div>
  );
}
`.trim();

// Write all files
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("Written:", filePath);
}

console.log("\\nDone! All files written successfully.");
</｜｜DSML｜｜parameter>
</｜｜DSML｜｜invoke>
</｜｜DSML｜｜tool_calls>
