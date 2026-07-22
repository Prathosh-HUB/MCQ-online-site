import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function writeFile(name, content) {
  const p = path.join(__dirname, name);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.trimStart(), 'utf8');
  console.log('✓', name);
}

// Login page
writeFile('src/app/login/page.js', `"use client";

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
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-purple-500/10 animate-blob-delayed" />
      </div>
      <Toaster position="top-center" richColors />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1 text-slate-400">Sign in to continue your tests</p>
        </div>
        <div className="rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-4 py-3 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Register
            </Link>
          </p>
        </div>
    </div>
  );
}
`);

// Register page
writeFile('src/app/register/page.js', `"use client";

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
    if (score <= 1) return { level: 1, label: "Weak", cls: "bg-red-500 w-1/3" };
    if (score <= 3) return { level: 2, label: "Medium", cls: "bg-yellow-500 w-2/3" };
    return { level: 3, label: "Strong", cls: "bg-green-500 w-full" };
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-slate-400">Join to start taking MCQ tests</p>
        </div>
        <div className="rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
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
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Min. 6 characters"
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className={"h-1 rounded " + pwdStr.cls}></div>
                    <span className={"text-xs font-medium " + pwdColor}>{pwdStr.label}</span>
                  </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 px-4 py-3 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign In
            </Link>
          </p>
        </div>
    </div>
  );
}
`);

// Home page
writeFile('src/app/page.js', `"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 animate-blob" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 animate-blob-delayed" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-6">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              MCQ Interview
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Practice your knowledge with timed MCQ tests. Track your progress,
              review answers, and improve your skills across various topics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-600/25"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 px-8 py-3 text-white font-medium transition-all"
              >
                Create Account
              </Link>
            </div>

          <div className="mt-24 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Timed Tests</h3>
              <p className="text-sm text-slate-400">Practice with real-time countdown timers to simulate exam conditions.</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-sm text-slate-400">View detailed results, scores, and time taken for each test attempt.</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold text-white mb-2">Review Answers</h3>
              <p className="text-sm text-slate-400">Review correct and incorrect answers to learn from your mistakes.</p>
            </div>
        </div>
    </div>
  );
}
`);

console.log('\\nAll files written successfully!');
</｜｜DSML｜｜parameter>
</invoke>
</｜｜DSML｜｜tool_calls>
