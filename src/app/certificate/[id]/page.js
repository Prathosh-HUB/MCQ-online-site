"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function CertificatePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [testAttempt, setTestAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const certRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user && id) {
      loadTestAttempt();
    }
  }, [user, loading, id]);

  const loadTestAttempt = async () => {
    try {
      const res = await fetch(`/api/test-attempts/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.testAttempt.submitted) {
          setError("Test not yet submitted");
        } else if ((data.testAttempt.score || 0) < 50) {
          setError("Certificate requires a score of 50% or higher");
        } else {
          setTestAttempt(data.testAttempt);
        }
      } else {
        setError("Failed to load test results");
      }
    } catch {
      setError("Failed to load test results");
    } finally {
      setIsLoading(false);
    }
  };

  const capitalizeName = (name) => {
    if (!name) return "Student";
    return name.toUpperCase();
  };

  const handlePrint = () => {
    if (certRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificate of Completion</title>
              <style>
                @page { size: landscape; margin: 0; }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: #0f172a;
                  font-family: 'Georgia', serif;
                }
                .certificate-wrapper {
                  width: 1000px;
                  height: 700px;
                  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                  border: 8px solid #f59e0b;
                  position: relative;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .certificate-inner {
                  width: 92%;
                  height: 88%;
                  border: 2px solid rgba(245, 158, 11, 0.3);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 40px;
                  text-align: center;
                  position: relative;
                }
                .certificate-inner::before {
                  content: '';
                  position: absolute;
                  top: 20px;
                  left: 20px;
                  right: 20px;
                  bottom: 20px;
                  border: 1px solid rgba(245, 158, 11, 0.15);
                  pointer-events: none;
                }
                .cert-icon {
                  width: 80px;
                  height: 80px;
                  margin-bottom: 10px;
                }
                h1 {
                  color: #f59e0b;
                  font-size: 36px;
                  margin: 5px 0;
                  letter-spacing: 4px;
                  text-transform: uppercase;
                  font-weight: bold;
                }
                .subtitle {
                  color: #94a3b8;
                  font-size: 16px;
                  margin-bottom: 15px;
                  letter-spacing: 2px;
                }
                .student-name {
                  color: #f8fafc;
                  font-size: 42px;
                  margin: 10px 0;
                  font-weight: bold;
                  border-bottom: 2px solid rgba(245, 158, 11, 0.3);
                  padding-bottom: 10px;
                  text-transform: uppercase;
                }
                .completion-text {
                  color: #cbd5e1;
                  font-size: 18px;
                  margin: 10px 0;
                }
                .test-title {
                  color: #f59e0b;
                  font-size: 24px;
                  font-weight: bold;
                  margin: 8px 0;
                }
                .score-display {
                  display: flex;
                  gap: 40px;
                  margin: 15px 0;
                }
                .score-item {
                  text-align: center;
                }
                .score-value {
                  color: #f8fafc;
                  font-size: 28px;
                  font-weight: bold;
                }
                .score-label {
                  color: #94a3b8;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .footer-text {
                  color: #64748b;
                  font-size: 12px;
                  margin-top: 15px;
                  letter-spacing: 1px;
                }
              </style>
            </head>
            <body>
              <div class="certificate-wrapper">
                <div class="certificate-inner">
                  <svg class="cert-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="38" stroke="#f59e0b" stroke-width="4" fill="none"/>
                    <circle cx="40" cy="40" r="28" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.5"/>
                    <path d="M30 40l7 7 13-13" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  </svg>
                  <h1>Certificate of Completion</h1>
                  <p class="subtitle">This certifies that</p>
                  <div class="student-name">${user?.name?.toUpperCase() || "STUDENT"}</div>
                  <p class="completion-text">has successfully completed the</p>
                  <div class="test-title">${testAttempt?.questionSet?.title || "MCQ Test"}</div>
                  <div class="score-display">
                    <div class="score-item">
                      <div class="score-value">${testAttempt?.score || 0}%</div>
                      <div class="score-label">Score</div>
                    <div class="score-item">
                      <div class="score-value">${testAttempt?.correctCount || 0}/${testAttempt?.totalQuestions || 0}</div>
                      <div class="score-label">Correct</div>
                    <div class="score-item">
                      <div class="score-value">${testAttempt ? new Date(testAttempt.endTime).toLocaleDateString() : ""}</div>
                      <div class="score-label">Date</div>
                  </div>
                  <p class="footer-text">MCQ Interview - Practice &amp; Prepare for Interviews</p>
                </div>
              <script>window.print(); window.close();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            {error.includes("50%") ? (
              <svg className="w-16 h-16 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4m0 4h.01"/>
              </svg>
            ) : (
              <svg className="w-16 h-16 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6m0-6l6 6"/>
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {error.includes("50%") ? "Certificate Not Available" : "Error"}
          </h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
    );
  }

  const score = testAttempt?.score || 0;
  const isPassed = score >= 50;

  if (!isPassed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <svg className="w-16 h-16 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Keep Practicing!</h2>
          <p className="text-slate-400 mb-2">
            You need a score of 50% or higher to earn a certificate.
          </p>
          <p className="text-slate-400 mb-6">
            Your score: <span className="text-red-400 font-bold">{score}%</span>
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-white">Certificate</h1>
          </div>
          <button
            onClick={handlePrint}
            className="bg-amber-600 hover:bg-amber-700 px-5 py-2.5 rounded-lg text-white font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </header>

      {/* Certificate Preview */}
      <main className="mx-auto px-6 py-12 flex justify-center">
        <div
          ref={certRef}
          className="relative w-full max-w-[1000px] aspect-[1.4] bg-gradient-to-br from-slate-800 to-slate-900 border-8 border-amber-500 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border border-amber-400 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 border border-amber-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-400 rounded-full"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-10 text-center">
            {/* Medal/Award SVG Icon */}
            <svg className="w-16 h-16 mb-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>

            <h1 className="text-3xl sm:text-4xl text-amber-400 font-bold tracking-[4px] uppercase mb-1">
              Certificate of Completion
            </h1>

            <p className="text-slate-400 text-sm sm:text-base mb-4 tracking-[2px]">
              This certifies that
            </p>

            <div className="text-3xl sm:text-4xl text-white font-bold mb-3 pb-3 border-b-2 border-amber-500/30 uppercase">
              {capitalizeName(user?.name)}
            </div>

            <p className="text-slate-300 text-base sm:text-lg mb-2">
              has successfully completed the
            </p>

            <div className="text-xl sm:text-2xl text-amber-400 font-bold mb-4">
              {testAttempt?.questionSet?.title || "MCQ Test"}
            </div>

            <div className="flex gap-6 sm:gap-12 mb-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl text-white font-bold">{score}%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Score</div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl text-white font-bold">
                  {testAttempt?.correctCount}/{testAttempt?.totalQuestions}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Correct</div>
              <div className="text-center">
                <div className="text-lg sm:text-xl text-white font-bold">
                  {testAttempt?.endTime
                    ? new Date(testAttempt.endTime).toLocaleDateString()
                    : ""}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Date</div>
            </div>

            <p className="text-xs text-slate-500 tracking-wider">
              MCQ Interview — Practice &amp; Prepare for Interviews
            </p>
          </div>
      </main>
    </div>
  );
}
