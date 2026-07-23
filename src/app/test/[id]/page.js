"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/lib/AuthContext";
import ImagePreview from "@/components/ImagePreview";
import { Toaster, toast } from "sonner";

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [testAttempt, setTestAttempt] = useState(null);
  const [questionSet, setQuestionSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef(null);
  const submitRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user && id) {
      loadTest();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [user, loading, id]);

  const loadTest = async () => {
    try {
      const res = await fetch(`/api/test-attempts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTestAttempt(data.testAttempt);
        setQuestionSet(data.testAttempt.questionSet);
        setQuestions(data.testAttempt.questionSet.questions);
        setTimeLeft(data.testAttempt.questionSet.timeLimit);

        // Restore existing answers
        const existingAnswers = {};
        data.testAttempt.answers.forEach((a) => {
          existingAnswers[a.questionId] = a.selectedAnswer;
        });
        setAnswers(existingAnswers);

        // Check if already submitted
        if (data.testAttempt.submitted) {
          setIsSubmitted(true);
        }
      } else {
        toast.error("Failed to load test");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to load test");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // Timer effect - use ref to avoid stale closure
  useEffect(() => {
    if (timeLeft === null || isSubmitted || isLoading || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto submit when time runs out using ref
          if (submitRef.current) {
            submitRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, isSubmitted, isLoading]);

  const handleAnswerSelect = (questionId, option) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const submitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/test-attempts/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSubmitted(true);
        toast.success("Test submitted successfully!");
        setTimeout(() => router.push(`/results/${id}`), 1000);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to submit test");
      }
    } catch {
      toast.error("Failed to submit test");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync submitRef with latest submitTest for timer auto-submit
  useEffect(() => {
    submitRef.current = submitTest;
  }, [submitTest]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter((a) => a !== null && a !== undefined && a !== "").length;
  };

  const currentQuestion = questions[currentIndex];

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Test Submitted!</h2>
          <p className="text-slate-400 mb-6">Redirecting to results...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster position="top-center" richColors />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <span className="text-white font-medium truncate">{questionSet?.title}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                timeLeft <= 60 ? "bg-red-500/20 border-red-500/50 text-red-400" : "bg-white/5 border-white/10 text-white"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>

              {/* Question Progress */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span className="text-white font-medium">{getAnsweredCount()}</span>
                <span>/</span>
                <span>{questions.length}</span>
                <span>answered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Question Palette - Left Side */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20 rounded-2xl bg-white/5 border border-white/10 p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const isAnswered = answers[q.id] && answers[q.id] !== "";
                  const isCurrent = index === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900"
                          : isAnswered
                          ? "bg-emerald-600/30 text-emerald-400 border border-emerald-600/50"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/20"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded bg-emerald-600/30 border border-emerald-600/50"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded bg-white/5 border border-white/10"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 rounded bg-blue-600 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900"></div>
                  <span>Current</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-slate-400 text-center">
                  <span className="text-white font-bold">{getAnsweredCount()}</span> / {questions.length} Answered
                </p>
              </div>
            </div>
          </div>

          {/* Question Area - Center */}
          <div className="flex-1">
            {currentQuestion && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
                {/* Question Number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                </div>

                {/* Question Text */}
                <h2 className="text-xl font-semibold text-white mb-8 leading-relaxed">
                  {currentQuestion.text}
                </h2>

                {/* Question Images */}
                {currentQuestion.imageUrls && Array.isArray(currentQuestion.imageUrls) && currentQuestion.imageUrls.filter(Boolean).length > 0 && (
                  <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.imageUrls.filter(Boolean).map((url, idx) => (
                      <div key={idx} className="flex justify-center bg-slate-800/50 rounded-xl p-2 border border-white/5">
                        <ImagePreview src={url} alt={`Question illustration ${idx + 1}`}>
                          <img
                            src={url}
                            alt={`Question illustration ${idx + 1}`}
                            className="max-w-full max-h-80 w-auto h-auto rounded-lg object-contain cursor-zoom-in"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        </ImagePreview>
                      </div>
                    ))}
                  </div>
                )}

{/* Options - MCQ or Fill Blanks */}
                {currentQuestion.questionType === "FILL_BLANKS" ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Your Answer</label>
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                      disabled={isSubmitted}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Type your answer here..."
                    />
                    <p className="text-xs text-slate-500 mt-2">Answer is case-insensitive</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, optIndex) => {
                      const isSelected = answers[currentQuestion.id] === option;
                      const optImage = currentQuestion.optionImages?.[optIndex];
                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-slate-500"
                          } ${isSubmitted ? "cursor-not-allowed opacity-75" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? "border-blue-500 bg-blue-500" : "border-slate-500"
                            }`}>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            {optImage && (
                              <ImagePreview src={optImage} alt="">
                                <img
                                  src={optImage}
                                  alt=""
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-white/10 cursor-zoom-in"
                                  onError={(e) => { e.target.style.display = "none"; }}
                                />
                              </ImagePreview>
                            )}
                            <span className="text-sm sm:text-base">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex gap-3">
                    {currentIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={submitTest}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-medium transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Test
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Question Palette - Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Questions</span>
          <span className="text-sm text-slate-400">
            <span className="text-white font-medium">{getAnsweredCount()}</span>/{questions.length}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] && answers[q.id] !== "";
            const isCurrent = index === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-9 h-9 rounded-lg text-xs font-medium flex-shrink-0 transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : isAnswered
                    ? "bg-emerald-600/30 text-emerald-400 border border-emerald-600/50"
                    : "bg-white/5 text-slate-400 border border-white/10"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

