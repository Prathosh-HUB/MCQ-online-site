"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function AdminQuestionSetsPage() {
  const router = useRouter();
  const [questionSets, setQuestionSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: 600,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-authenticated");
    if (isAuth !== "true") {
      router.push("/admin/login");
      return;
    }
    fetchQuestionSets();
  }, [router]);

  const fetchQuestionSets = async () => {
    try {
      const res = await fetch("/api/admin/question-sets");
      if (res.ok) {
        const data = await res.json();
        setQuestionSets(data.questionSets);
      }
    } catch {
      toast.error("Failed to load question sets");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSet(null);
    setFormData({ title: "", description: "", timeLimit: 600 });
    setShowModal(true);
  };

  const openEditModal = (set) => {
    setEditingSet(set);
    setFormData({
      title: set.title,
      description: set.description || "",
      timeLimit: set.timeLimit,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      let res;
      if (editingSet) {
        res = await fetch(`/api/admin/question-sets/${editingSet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/question-sets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        toast.success(editingSet ? "Question set updated!" : "Question set created!");
        setShowModal(false);
        fetchQuestionSets();
      } else {
        const data = await res.json();
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this question set? All associated questions and attempts will be deleted.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/question-sets/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Question set deleted");
        fetchQuestionSets();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
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
            <h1 className="text-xl font-bold text-white">Question Sets</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-all"
          >
            + Create Set
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-800 rounded-xl p-6">
                <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : questionSets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Question Sets</h3>
            <p className="text-slate-400 mb-6">Create your first question set to get started</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
            >
              Create Set
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {questionSets.map((set) => (
              <div
                key={set.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{set.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(set)}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(set.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {set.description && (
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{set.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span>{set._count.questions} Questions</span>
                  <span>{formatTime(set.timeLimit)}</span>
                  <span>{set._count.testAttempts} Attempts</span>
                </div>

                <div className="text-xs text-slate-500">
                  by {set.createdBy?.name || "Admin"}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingSet ? "Edit Question Set" : "Create Question Set"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. JavaScript Basics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Description of the test..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={formData.timeLimit / 60}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) * 60 || 600 })}
                  min={1}
                  max={180}
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-white font-medium transition-all"
                >
                  {editingSet ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

