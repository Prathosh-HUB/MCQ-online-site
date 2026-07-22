import os

def w(path, content):
    full = os.path.join(os.getcwd(), path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Written:", path)

# Helper to build closing tags that don't get stripped
CLOSE = chr(60) + '/'  # </
CLOSE_DIV = CLOSE + 'div' + chr(62)  # </div>
CLOSE_MAIN = CLOSE + 'main' + chr(62)  # </main>
CLOSE_NAV = CLOSE + 'nav' + chr(62)  # </nav>
CLOSE_FOOTER = CLOSE + 'footer' + chr(62)  # </footer>
CLOSE_H1 = CLOSE + 'h1' + chr(62)  # </h1>
CLOSE_P = CLOSE + 'p' + chr(62)  # </p>
CLOSE_SPAN = CLOSE + 'span' + chr(62)  # </span>
CLOSE_A = CLOSE + 'a' + chr(62)  # </a>
CLOSE_LABEL = CLOSE + 'label' + chr(62)  # </label>
CLOSE_FORM = CLOSE + 'form' + chr(62)  # </form>
CLOSE_BUTTON = CLOSE + 'button' + chr(62)  # </button>
CLOSE_H2 = CLOSE + 'h2' + chr(62)  # </h2>
CLOSE_H3 = CLOSE + 'h3' + chr(62)  # </h3>
CLOSE_SECTION = CLOSE + 'section' + chr(62)
CLOSE_HEADER = CLOSE + 'header' + chr(62)
CLOSE_BR = chr(60) + 'br />'
CLOSE_INPUT = '/>'
CLOSE_SVG = CLOSE + 'svg' + chr(62)
CLOSE_PATH = CLOSE + 'path' + chr(62)

# ============= page.js =============
page_js = '''"use client";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      ''' + CLOSE_DIV + '''
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-blob-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-float" />
      ''' + CLOSE_DIV + '''
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            ''' + CLOSE_DIV + '''
            <span className="font-bold text-lg text-text-primary">MCQ Interview</span>
          ''' + CLOSE_DIV + '''
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-all hover-glow">Get Started</Link>
          ''' + CLOSE_DIV + '''
        ''' + CLOSE_NAV + '''
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-bg border border-accent/20 text-accent text-sm font-medium mb-8 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              Practice &amp; Prepare for Interviews
            ''' + CLOSE_DIV + '''
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6 animate-fade-in-up">
              Master Your <span className="text-gradient">Interview Skills</span>
              <br />
              with MCQ Tests
            ''' + CLOSE_H1 + '''
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              Take timed MCQ tests, track your progress, and improve your knowledge across JavaScript, React, and general programming concepts.
            ''' + CLOSE_P + '''
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <Link href="/register" className="px-8 py-3.5 text-base font-medium text-white bg-accent hover:bg-accent-hover rounded-xl transition-all hover-glow flex items-center gap-2">
                Create Free Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                ''' + CLOSE_PATH + '''
              ''' + CLOSE_SVG + '''
              ''' + CLOSE_DIV.replace('</div>', '</Link>') + '''
              <Link href="/login" className="px-8 py-3.5 text-base font-medium text-text-secondary border border-border-default hover:border-border-hover rounded-xl transition-all">Sign In</Link>
            ''' + CLOSE_DIV + '''
          ''' + CLOSE_DIV + '''
        ''' + CLOSE_MAIN + '''
        <footer className="py-6 text-center text-sm text-text-muted border-t border-border-default">
          <p>MCQ Interview - Built with Next.js &amp; Prisma</p>
        ''' + CLOSE_FOOTER + '''
      ''' + CLOSE_DIV + '''
    ''' + CLOSE_DIV + '''
  );
}
'''

w('src/app/page.js', page_js)

# ============= login/page.js =============
login_js = r'''"use client";

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
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-500/5 animate-blob-delayed" />
      ''' + CLOSE_DIV + '''
      <Toaster position="top-center" richColors />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-brand mb-4">
            <span className="text-white font-bold text-xl">M</span>
          ''' + CLOSE_DIV + '''
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="mt-1 text-text-secondary">Sign in to continue your tests</p>
        ''' + CLOSE_DIV + '''
        <div className="rounded-2xl bg-bg-card border border-border-default p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="floating-label-group">
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
              <label htmlFor="email">Email</label>
            ''' + CLOSE_DIV + '''
            <div className="floating-label-group">
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " required />
              <label htmlFor="password">Password</label>
            ''' + CLOSE_DIV + '''
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-accent hover:bg-accent-hover disabled:bg-accent/50 px-4 py-3 text-white font-medium transition-all hover-glow"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            ''' + CLOSE_BUTTON.replace('</button>', '</button>') + '''
          ''' + CLOSE_FORM + '''
          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent hover:text-accent-hover font-medium">Register</Link>
          ''' + CLOSE_P + '''
        ''' + CLOSE_DIV.replace('</div>', '</div>') + '''
      ''' + CLOSE_DIV + '''
    ''' + CLOSE_DIV + '''
  );
}
'''

w('src/app/login/page.js', login_js)

print("\nAll files written!")
</create_file>
