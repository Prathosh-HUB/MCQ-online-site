"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function AdminQuestionsPage() {
  const router = useRouter();
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState(null);
  const [formData, setFormData] = useState({
    questionSetId: "",
    text: "",
    options: ["", ""],
    correctAnswer: "",
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

  const fetchQuestions = async (questionSetId) => {
    try {
      const res = await fetch(`/api/admin/questions?questionSetId=${questionSetId}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    } catch {
      toast.error("Failed to load questions");
    }
  };

  const handleSetChange = (setId) => {
    setSelectedSetId(setId);
    if (setId) {
      fetchQuestions(setId);
    } else {
      setQuestions([]);
    }
  };

  const openCreateModal = () => {
    if (!selectedSetId) {
      toast.error("Please select a question set first");
      return;
    }
    setEditingQ(null);
    setFormData({
      questionSetId: selectedSetId,
      text: "",
      options: ["", ""],
      correctAnswer: "",
    });
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingQ(q);
    setFormData({
      questionSetId: q.questionSetId.toString(),
      text: q.text,
      options: Array.isArray(q.options) ? [...q.options] : [],
      correctAnswer: q.correctAnswer,
    });
    setShowModal(true);
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correctAnswer: prev.correctAnswer === prev.options[index] ? "" : prev.correctAnswer,
    }));
  };

  const updateOption = (index, value) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error("Question text is required");
      return;
    }

    const validOptions = formData.options.filter((o) => o.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("At least 2 options are required");
      return;
    }

    if (!formData.correctAnswer) {
      toast.error("Please select the correct answer");
      return;
    }

    try {
      let res;
      const payload = {
        text: formData.text,
        options: validOptions,
        correctAnswer: formData.correctAnswer,
      };

      if (editingQ) {
        res = await fetch(`/api/admin/questions/${editingQ.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        payload.questionSetId = parseInt(selectedSetId);
        res = await fetch("/api/admin/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast.success(editingQ ? "Question updated!" : "Question created!");
        setShowModal(false);
        fetchQuestions(selectedSetId);
      } else {
        const data = await res.json();
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;

    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Question deleted");
        fetchQuestions(selectedSetId);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
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
            <h1 className="text-xl font-bold text-white">Questions</h1>
          </div>
          <button
            onClick={openCreateModal}
            disabled={!selectedSetId}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 px-4 py-2 rounded-lg text-white font-medium transition-all"
          >
            + Add Question
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Set Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Question Set
          </label>
          <select
            value={selectedSetId}
            onChange={(e) => handleSetChange(e.target.value)}
            className="w-full max-w-md rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="">-- Choose a question set --</option>
            {questionSets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.title} ({set._count.questions} questions)
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-800 rounded-xl p-6">
                <div className="h-5 bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : !selectedSetId ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-semibold text-white mb-2">Select a Question Set</h3>
            <p className="text-slate-400">Choose a question set above to manage its questions</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Questions Yet</h3>
            <p className="text-slate-400 mb-6">Add your first question to this set</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
            >
              Add Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                      Q{index + 1}
                    </span>
                    <h3 className="text-white font-medium">{q.text}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(q)}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-2">
                  {Array.isArray(q.options) && q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm ${
                        opt === q.correctAnswer
                          ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                          : "bg-slate-700/50 border-slate-600 text-slate-300"
                      }`}
                    >
                      <span className="text-xs font-mono text-slate-500 w-5">{String.fromCharCode(65 + i)}.</span>
                      <span>{opt}</span>
                      {opt === q.correctAnswer && (
                        <span className="ml-auto text-xs font-medium text-emerald-400">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingQ ? "Edit Question" : "Add Question"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Question Text</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  rows={3}
                  className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Enter your question..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Options</label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-mono text-slate-500 w-6">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        placeholder={`Option ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === opt}
                        onChange={() => setFormData({ ...formData, correctAnswer: opt })}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-500 focus:ring-blue-500"
                        title="Mark as correct answer"
                      />
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Select the radio button for the correct answer</p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-white font-medium transition-all"
                >
                  {editingQ ? "Update" : "Create"}
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

