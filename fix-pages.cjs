const fs = require('fs');
const path = require('path');

const dir = __dirname;

function writeFile(relPath, content) {
  const absPath = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content, 'utf8');
  console.log('OK:', relPath);
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

console.log('\\nDone');
</｜｜DSML｜｜parameter>
</invoke>
</｜｜DSML｜｜tool_calls>
