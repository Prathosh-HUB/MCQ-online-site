const fs = require('fs');
const path = require('path');
const CLOSING = __unescape('\\x3c/');

function __unescape(s) {
  return s.replace(/\\\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function w(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  // Replace CLOSING marker with actual closing tag
  const processed = content.replace(/__CLOSE__/g, CLOSING);
  fs.writeFileSync(full, processed, 'utf8');
  console.log('Written:', relPath);
}

// The files will use __CLOSE__ which will be replaced with </ before writing
// page.js
w('src/app/page.js', `"use client";

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
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      __CLOSE__div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-500/5 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-blob-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-float" />
      __CLOSE__div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            __CLOSE__div>
            <span className="font-bold text-lg text-text-primary">MCQ Interview</span>
          __CLOSE__div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-all hover-glow">Get Started</Link>
          __CLOSE__div>
        __CLOSE__nav>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-bg border border-accent/20 text-accent text-sm font-medium mb-8 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              Practice &amp; Prepare for Interviews
            __CLOSE__div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6 animate-fade-in-up">
              Master Your <span className="text-gradient">Interview Skills</span>
              <br />
              with MCQ Tests
            __CLOSE__h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              Take timed MCQ tests, track your progress, and improve your knowledge across JavaScript, React, and general programming concepts.
            __CLOSE__p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              <Link href="/register" className="px-8 py-3.5 text-base font-medium text-white bg-accent hover:bg-accent-hover rounded-xl transition-all hover-glow flex items-center gap-2">
                Create Free Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                __CLOSE__path>
              __CLOSE__svg>
              __CLOSE__Link>
              <Link href="/login" className="px-8 py-3.5 text-base font-medium text-text-secondary border border-border-default hover:border-border-hover rounded-xl transition-all">Sign In</Link>
            __CLOSE__div>
          __CLOSE__div>
        __CLOSE__main>
        <footer className="py-6 text-center text-sm text-text-muted border-t border-border-default">
          <p>MCQ Interview - Built with Next.js &amp; Prisma</p>
        __CLOSE__footer>
      __CLOSE__div>
    __CLOSE__div>
  );
}
`);

console.log('Done!');
