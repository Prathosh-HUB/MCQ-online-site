"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function AdminResultsPage() {
  const router = useRouter();
  const [testAttempts, setTestAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-authenticated");
    if (isAuth !== "true") {
      router.push("/admin/login");
      return;
    }
    fetchResults();
  }, [router]);

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/admin/results");
      if (res.ok) {
        const data = await res.json();
        setTestAttempts(data.testAttempts);
      }
    } catch {
      toast.error("Failed to load results");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttempts = testAttempts.filter((attempt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      attempt.user?.name?.toLowerCase().includes(term) ||
      attempt.user?.email?.toLowerCase().includes(term) ||
      attempt.questionSet?.title?.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTimeTaken = (attempt) => {
    if (!attempt.startTime || !attempt.endTime) return "-";
    const diff = Math.floor(
      (new Date(attempt.endTime) - new Date(attempt.startTime)) / 1000
    );
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster position="top-center" richColors />

      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">Test Results</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, or test title..."
            className="w-full max-w-md rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-800 rounded-xl p-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-700 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? "No Results Found" : "No Test Results Yet"}
            </h3>
            <p className="text-slate-400">
              {searchTerm
                ? "Try a different search term"
                : "Results will appear once students complete tests"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-400 border-b border-slate-700">
                  <th className="pb-3 pr-4 font-medium">Student</th>
                  <th className="pb-3 pr-4 font-medium">Test</th>
                  <th className="pb-3 pr-4 font-medium">Score</th>
                  <th className="pb-3 pr-4 font-medium">Correct</th>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredAttempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          {attempt.user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="text-white font-medium">{attempt.user?.name || "Unknown"}</div>
                          <div className="text-slate-500 text-xs">{attempt.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-white">{attempt.questionSet?.title || "Unknown"}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`font-bold ${
                          attempt.score >= 50
                            ? "text-emerald-400"
                            : attempt.score !== null
                            ? "text-red-400"
                            : "text-slate-400"
                        }`}
                      >
                        {attempt.score !== null ? `${attempt.score}%` : "-"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-300">
                      {attempt.submitted
                        ? `${attempt.correctCount}/${attempt.totalQuestions}`
                        : "-"}
                    </td>
                    <td className="py-4 pr-4 text-slate-300">{calculateTimeTaken(attempt)}</td>
                    <td className="py-4 pr-4 text-slate-300">{formatDate(attempt.startTime)}</td>
                    <td className="py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          attempt.submitted
                            ? attempt.score >= 50
                              ? "bg-emerald-600/20 text-emerald-400"
                              : "bg-red-600/20 text-red-400"
                            : "bg-yellow-600/20 text-yellow-400"
                        }`}
                      >
                        {attempt.submitted
                          ? attempt.score >= 50
                            ? "Passed"
                            : "Failed"
                          : "In Progress"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-sm text-slate-500 mt-4">
              Showing {filteredAttempts.length} result(s)
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

