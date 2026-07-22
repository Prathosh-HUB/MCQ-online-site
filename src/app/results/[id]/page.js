"use client";
// import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Toaster, toast } from "sonner";

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [testAttempt, setTestAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user && id) {
      loadResults();
    }
  }, [user, loading, id]);

  const loadResults = async () => {
    try {
      const res = await fetch(`/api/test-attempts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTestAttempt(data.testAttempt);
      } else {
        toast.error("Failed to load results");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to load results");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowAnswer = (questionId) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const calculateTimeTaken = () => {
    if (!testAttempt) return "0:00";
    const start = new Date(testAttempt.startTime);
    const end = testAttempt.endTime ? new Date(testAttempt.endTime) : new Date();
    const diff = Math.floor((end - start) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!testAttempt) return null;

  const { questionSet, answers } = testAttempt;
  const score = testAttempt.score || 0;
  const isPassed = score >= 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
                Q
              </div>
              <span className="text-xl font-bold text-white">MCQ Interview</span>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm text-white transition-all"
            >
              Back to Dashboard
            </button>
          <button
  onClick={() => router.push(`/certificate/${id}`)}
  className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm text-white transition-all"
>
  🎓 View Certificate
</button>
            
            


          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className={`rounded-2xl border p-8 mb-8 text-center ${
          isPassed ? "bg-emerald-600/10 border-emerald-500/30" : "bg-red-600/10 border-red-500/30"
        }`}>
          <div className="text-6xl mb-4">{isPassed ? "GREAT!!" : "NOT WELL"}</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPassed ? "Congratulations!" : "Keep Practicing!"}
          </h1>
          <p className="text-slate-400 mb-6">{questionSet.title}</p>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className={`text-4xl font-bold ${isPassed ? "text-emerald-400" : "text-red-400"}`}>
                {score}%
              </div>
              <p className="text-sm text-slate-400 mt-1">Score</p>
            </div>

            <div className="w-px h-12 bg-white/10"></div>

            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {testAttempt.correctCount}
              </div>
              <p className="text-sm text-slate-400 mt-1">Correct</p>
            </div>

            <div className="w-px h-12 bg-white/10"></div>

            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {testAttempt.totalQuestions - testAttempt.correctCount}
              </div>
              <p className="text-sm text-slate-400 mt-1">Incorrect</p>
            </div>

            <div className="w-px h-12 bg-white/10"></div>

            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {calculateTimeTaken()}
              </div>
              <p className="text-sm text-slate-400 mt-1">Time Taken</p>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Question Review</h2>
          
          {questionSet.questions.map((question, index) => {
            const answer = answers.find((a) => a.questionId === question.id);
            const selectedAnswer = answer?.selectedAnswer || "Not answered";
            const isCorrect = answer?.isCorrect;
            const showAnswer = showAnswers[question.id];

            return (
              <div
                key={question.id}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                    Question {index + 1}
                  </span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                    isCorrect === true
                      ? "bg-emerald-600/20 text-emerald-400"
                      : isCorrect === false
                      ? "bg-red-600/20 text-red-400"
                      : "bg-yellow-600/20 text-yellow-400"
                  }`}>
                    {isCorrect === true ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Correct
                      </>
                    ) : isCorrect === false ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Incorrect
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Not Answered
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-lg text-white mb-4">{question.text}</h3>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => {
                    const isSelectedOption = selectedAnswer === option;
                    const isCorrectOption = question.correctAnswer === option;

                    let optionStyle = "bg-white/5 border-white/10 text-slate-300";
                    if (isCorrectOption) {
                      optionStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-300";
                    } else if (isSelectedOption && !isCorrect) {
                      optionStyle = "bg-red-600/20 border-red-500 text-red-300";
                    }

                    return (
                      <div
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${optionStyle}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isCorrectOption ? "border-emerald-500 bg-emerald-500" :
                          isSelectedOption && !isCorrect ? "border-red-500 bg-red-500" :
                          "border-slate-500"
                        }`}>
                          {(isCorrectOption || (isSelectedOption && !isCorrect)) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {isCorrectOption ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{option}</span>
                        {isCorrectOption && (
                          <span className="ml-auto text-xs font-medium text-emerald-400">Correct Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom padding for mobile nav */}
      <div className="h-4"></div>
    </div>
  );
}

