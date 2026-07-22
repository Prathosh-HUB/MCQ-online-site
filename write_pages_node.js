const fs = require('fs');
const path = require('path');

function w(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Written:', relPath);
}

// page.js - use a workaround for closing tags
const pageContent = `"use client";

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
    return React.createElement('div', { className: 'flex min-h-screen items-center justify-center bg-bg-primary' },
      React.createElement('div', { className: 'animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent' })
    );
  }

  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'absolute inset-0 overflow-hidden pointer-events-none' }),
    React.createElement('div', { className: 'relative z-10 flex flex-col min-h-screen' })
  );
}
`;

w('src/app/page.js', pageContent);

// login page - original working version kept intact
const loginContent = `"use client";

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
`;

w('src/app/login/page.js', loginContent);

// register page
const registerContent = `"use client";

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
    if (score <= 1) return { level: 1, label: "Weak", cls: "password-strength-weak" };
    if (score <= 3) return { level: 2, label: "Medium", cls: "password-strength-medium" };
    return { level: 3, label: "Strong", cls: "password-strength-strong" };
  };

  const pwdStr = getStrength(password);
  const pwdColor = pwdStr.level === 1 ? 'text-danger-text' : pwdStr.level === 2 ? 'text-warning-text' : 'text-success-text';

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
              <input type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
              <label htmlFor="reg-email">Email</label>
            </div>
            <div>
              <div className="floating-label-group">
                <input type="password" id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " minLength={6} required />
                <label htmlFor="reg-password">Password</label>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className={"password-strength-bar " + pwdStr.cls} />
                    <span className={"text-xs font-medium " + pwdColor}>{pwdStr.label}</span>
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
`;

w('src/app/register/page.js', registerContent);

console.log('\\nAll files written successfully!');
