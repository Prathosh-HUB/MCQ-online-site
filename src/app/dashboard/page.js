"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Toaster, toast } from "sonner";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [questionSets, setQuestionSets] = useState([]);
  const [isLoadingSets, setIsLoadingSets] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchQuestionSets();
    }
  }, [user, loading]);

  const fetchQuestionSets = async () => {
    try {
      const res = await fetch("/api/question-sets");
      if (res.ok) {
        const data = await res.json();
        setQuestionSets(data.questionSets);
      }
    } catch (error) {
      toast.error("Failed to load question sets");
    } finally {
      setIsLoadingSets(false);
    }
  };

  const handleStartTest = async (questionSetId) => {
    try {
      const res = await fetch("/api/test-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionSetId }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/test/${data.testAttempt.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to start test");
      }
    } catch {
      toast.error("Failed to start test");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} min`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
                Q
              </div>
              <span className="text-xl font-bold text-white">MCQ Interview</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 hidden sm:block">
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm text-white transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Available Tests</h2>
          <p className="mt-1 text-slate-400">Select a test to start practicing</p>
        </div>

        {isLoadingSets ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                <div className="h-5 bg-white/10 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-full mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : questionSets.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Tests Available</h3>
            <p className="text-slate-400">
              Check back later for new test questions
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {questionSets.map((set) => (
              <div
                key={set.id}
                className="group rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {set.title}
                    </h3>
                    {set.description && (
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                        {set.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {set._count.questions} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(set.timeLimit)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    by {set.createdBy.name}
                  </span>
                  <button
                    onClick={() => handleStartTest(set.id)}
                    disabled={set._count.questions === 0}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-2 text-sm text-white font-medium transition-all transform hover:scale-105 active:scale-95"
                  >
                    {set._count.questions === 0 ? "No Questions" : "Start Test"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

