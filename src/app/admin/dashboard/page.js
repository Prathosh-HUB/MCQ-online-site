"use client";

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
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-bold">Students</h2>
          <p className="text-slate-400 mt-2">View, Add &amp; Remove Students</p>
        </Link>
        <Link href="/admin/question-set" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-bold">Question Sets</h2>
          <p className="text-slate-400 mt-2">Create &amp; Manage Test Sets</p>
        </Link>
        <Link href="/admin/question" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">❓</div>
          <h2 className="text-xl font-bold">Questions</h2>
          <p className="text-slate-400 mt-2">Add &amp; Edit Questions</p>
        </Link>
        <Link href="/admin/results" className="bg-slate-800 rounded-xl p-8 hover:bg-slate-700 transition-all hover:scale-[1.02] border border-slate-700 hover:border-blue-500/50">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-bold">Results</h2>
          <p className="text-slate-400 mt-2">View All Test Results</p>
        </Link>
      </div>
    </div>
  );
}
