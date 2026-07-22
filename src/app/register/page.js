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

  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
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
    </div>
  );
}
