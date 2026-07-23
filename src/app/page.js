"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/lib/AuthContext";
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
            <Link href="/login"  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all">Login</Link>
            <Link href="/admin/login" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-purple-400 transition-colors border border-slate-700 hover:border-purple-500/50 rounded-lg">Admin</Link>
            {/* <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all">Get Started</Link> */}
          </div>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Practice &amp; Prepare for Interviews
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
           Welcome To <span className="text-blue-400">Online Assessment </span>
              <br />
              with MCQ Tests
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Take timed MCQ tests, track your progress, and improve your knowledge across JavaScript, React, and general programming concepts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* <Link href="/register" className="px-8 py-3.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all flex items-center gap-2">
                Create Free Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link> */}
              <Link href="/login" className="px-8 py-3.5 text-base font-medium text-slate-300 border border-slate-600 hover:border-slate-500 rounded-xl transition-all">Login</Link>
            </div>
            </div>
        </main>
        <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-800">
          <p>MCQ Interview - Built with Next.js &amp; Prisma</p>
        </footer>
      </div>
      </div>
  );
}
