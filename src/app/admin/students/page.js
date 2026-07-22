"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-authenticated");
    if (isAuth !== "true") {
      router.push("/admin/login");
      return;
    }
    fetchStudents();
  }, [router]);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
      }
    } catch {
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Student deleted successfully");
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete student");
      }
    } catch {
      toast.error("Failed to delete student");
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster position="top-center" richColors />

      {/* Header */}
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
            <h1 className="text-xl font-bold text-white">Students</h1>
          </div>
          <Link
            href="/admin/students/create"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-all"
          >
            + Add Student
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-800 rounded-xl p-6">
                <div className="h-5 bg-slate-700 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Students Yet</h3>
            <p className="text-slate-400 mb-6">Start by adding your first student</p>
            <Link
              href="/admin/students/create"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium inline-block transition-all"
            >
              Add Student
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-between hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{student.name}</h3>
                    <p className="text-sm text-slate-400">{student.email}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {student._count.testAttempts} test(s) taken • Joined{" "}
                      {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student._count.testAttempts > 0
                        ? "bg-emerald-600/20 text-emerald-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {student._count.testAttempts > 0 ? "Active" : "Inactive"}
                  </span>
                  {deleteId === student.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-white text-sm font-medium transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-white text-sm transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(student.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded text-sm transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

