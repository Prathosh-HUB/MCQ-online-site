"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import ImagePreview from "@/components/ImagePreview";

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
    questionType: "MCQ",
    imageUrls: ["", "", "", ""],
    options: ["", "", "", ""],
    optionImages: ["", "", "", ""],
    correctAnswer: "",
  });
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null);
  const [uploadingOptionImage, setUploadingOptionImage] = useState(null);

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

  const handleImageUpload = async (file, imgIndex) => {
    if (!file) return;
    setUploadingImageIndex(imgIndex);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => {
          const newUrls = [...prev.imageUrls];
          newUrls[imgIndex] = data.url;
          return { ...prev, imageUrls: newUrls };
        });
        toast.success("Image uploaded!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleOptionImageUpload = async (file, optIndex) => {
    if (!file) return;
    setUploadingOptionImage(optIndex);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => {
          const newOptImages = [...prev.optionImages];
          newOptImages[optIndex] = data.url;
          return { ...prev, optionImages: newOptImages };
        });
        toast.success("Option image uploaded!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingOptionImage(null);
    }
  };

  const clearImageUrl = (index) => {
    setFormData((prev) => {
      const newUrls = [...prev.imageUrls];
      newUrls[index] = "";
      return { ...prev, imageUrls: newUrls };
    });
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
      questionType: "MCQ",
      imageUrls: ["", "", "", ""],
      options: ["", "", "", ""],
      optionImages: ["", "", "", ""],
      correctAnswer: "",
    });
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingQ(q);
    const optCount = Array.isArray(q.options) ? q.options.length : 4;
    const opts = Array.isArray(q.options) ? [...q.options] : [];
    let correctIdx = "";
    if (q.correctAnswer && opts.length > 0) {
      const found = opts.indexOf(q.correctAnswer);
      if (found !== -1) correctIdx = String(found);
    }
    setFormData({
      questionSetId: q.questionSetId.toString(),
      text: q.text,
      questionType: q.questionType || "MCQ",
      imageUrls: q.imageUrls && Array.isArray(q.imageUrls) ? [...q.imageUrls] : ["", "", "", ""],
      options: opts,
      optionImages: q.optionImages && Array.isArray(q.optionImages) ? [...q.optionImages] : Array(optCount).fill(""),
      correctAnswer: q.questionType === "FILL_BLANKS" ? (q.correctAnswer || "") : correctIdx,
    });
    setShowModal(true);
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
      optionImages: [...prev.optionImages, ""],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      optionImages: prev.optionImages.filter((_, i) => i !== index),
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

  const clearOptionImage = (index) => {
    setFormData((prev) => {
      const newOptImages = [...prev.optionImages];
      newOptImages[index] = "";
      return { ...prev, optionImages: newOptImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error("Question text is required");
      return;
    }

    if (formData.questionType === "FILL_BLANKS") {
      const validImageUrls = formData.imageUrls.filter((url) => url && url.trim() !== "");

      try {
        let res;
        const payload = {
          text: formData.text,
          questionType: "FILL_BLANKS",
          imageUrls: validImageUrls.length > 0 ? validImageUrls : null,
          options: [],
          optionImages: null,
          correctAnswer: formData.correctAnswer.trim(),
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
      return;
    }

    // Auto-fill any option that has an image but no text
    const filledOptions = formData.options.map((opt, i) => {
      if (opt.trim() === "" && formData.optionImages[i]) {
        return `Option ${String.fromCharCode(65 + i)}`;
      }
      return opt;
    });

    const validOptions = filledOptions.filter((o) => o.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("At least 2 options with text or images are required");
      return;
    }

    let correctAnswer = "";
    const selectedIdx = parseInt(formData.correctAnswer, 10);
    if (!isNaN(selectedIdx) && selectedIdx >= 0 && selectedIdx < filledOptions.length) {
      correctAnswer = filledOptions[selectedIdx];
    }

    if (!correctAnswer) {
      toast.error("Please select the correct answer");
      return;
    }

    const validOptionImages = [];
    filledOptions.forEach((opt, i) => {
      if (opt.trim() !== "") {
        validOptionImages.push(formData.optionImages[i] || null);
      }
    });

    const validImageUrls = formData.imageUrls.filter((url) => url && url.trim() !== "");

    try {
      let res;
      const payload = {
        text: formData.text,
        imageUrls: validImageUrls.length > 0 ? validImageUrls : null,
        optionImages: validOptionImages.some((img) => img) ? validOptionImages : null,
        options: validOptions,
        correctAnswer,
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
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full flex-shrink-0">
                      Q{index + 1}
                    </span>
                    <h3 className="text-white font-medium break-words">{q.text}</h3>
                    <span className={"text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 " + (
                      q.questionType === "FILL_BLANKS"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    )}>
                      {q.questionType === "FILL_BLANKS" ? "Fill Blanks" : "MCQ"}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
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

                {q.questionType === "FILL_BLANKS" ? (
                  <div className="bg-slate-700/30 border border-amber-600/30 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Correct Answer (Reference)</p>
                    <p className="text-sm font-medium text-slate-300 whitespace-pre-wrap">{q.correctAnswer}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.isArray(q.options) && q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={"flex items-center gap-2 p-2.5 rounded-lg border text-sm overflow-hidden " + (
                          opt === q.correctAnswer
                            ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                            : "bg-slate-700/50 border-slate-600 text-slate-300"
                        )}
                      >
                        <span className="text-xs font-mono text-slate-500 w-5 flex-shrink-0">{String.fromCharCode(65 + i)}.</span>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {q.optionImages && q.optionImages[i] && (
                            <ImagePreview src={q.optionImages[i]} alt="">
                              <img src={q.optionImages[i]} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover cursor-zoom-in" />
                            </ImagePreview>
                          )}
                          <span className="truncate">{opt}</span>
                        </div>
                        {opt === q.correctAnswer && (
                          <span className="ml-auto text-xs font-medium text-emerald-400 flex-shrink-0">&#10003;</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-6xl my-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingQ ? "Edit Question" : "Add Question"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left Column - Question */}
                <div className="space-y-4">
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

                  {/* Question Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Question Type</label>
                    <div className="flex gap-3">
                      <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                        formData.questionType === "MCQ"
                          ? "bg-blue-600/20 border-blue-500 text-blue-300"
                          : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}>
                        <input
                          type="radio"
                          name="questionType"
                          value="MCQ"
                          checked={formData.questionType === "MCQ"}
                          onChange={() => setFormData({ ...formData, questionType: "MCQ", options: ["", "", "", ""], optionImages: ["", "", "", ""], correctAnswer: "" })}
                          className="sr-only"
                        />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm font-medium">Multiple Choice</span>
                      </label>
                      <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${
                        formData.questionType === "FILL_BLANKS"
                          ? "bg-amber-600/20 border-amber-500 text-amber-300"
                          : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                      }`}>
                        <input
                          type="radio"
                          name="questionType"
                          value="FILL_BLANKS"
                          checked={formData.questionType === "FILL_BLANKS"}
                          onChange={() => setFormData({ ...formData, questionType: "FILL_BLANKS", options: [], optionImages: [], correctAnswer: "" })}
                          className="sr-only"
                        />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm font-medium">Fill in the Blank</span>
                      </label>
                    </div>
                  </div>

                  {/* Question Images (up to 4) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Question Images (up to 4, optional)
                    </label>
                    <div className="space-y-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 w-5 flex-shrink-0 font-mono">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={formData.imageUrls[idx] || ""}
                            onChange={(e) => {
                              const newUrls = [...formData.imageUrls];
                              newUrls[idx] = e.target.value;
                              setFormData({ ...formData, imageUrls: newUrls });
                            }}
                            className="flex-1 rounded-lg bg-slate-700 border border-slate-600 px-3 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                            placeholder={`Image URL ${idx + 1} or upload...`}
                          />
                          <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {uploadingImageIndex === idx ? "..." : "Upload"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files[0]) handleImageUpload(e.target.files[0], idx);
                                e.target.value = "";
                              }}
                            />
                          </label>
                          {formData.imageUrls[idx] && (
                            <button
                              type="button"
                              onClick={() => clearImageUrl(idx)}
                              className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Image Previews */}
                    {formData.imageUrls.some((u) => u) && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {formData.imageUrls.map((url, idx) =>
                          url ? (
                            <div key={idx} className="relative inline-block">
                              <img
                                src={url}
                                alt={`Preview ${idx + 1}`}
                                className="h-16 w-20 rounded-lg border border-slate-600 object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                              <span className="absolute -top-1.5 -left-1.5 bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-white text-[9px] font-bold">
                                {idx + 1}
                              </span>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Options or Correct Answer */}
                <div className="space-y-4">
                  {formData.questionType === "FILL_BLANKS" ? (
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Correct Answer (Reference - Not Graded)</label>
                      <textarea
                        value={formData.correctAnswer}
                        onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                        rows={8}
                        className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                        placeholder="Enter the correct answer or reference text..."
                      />
                      <p className="text-[10px] text-slate-500 mt-2">This is shown as reference only. Any student response is stored but does not affect the score.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-300">Options</label>
                        <button
                          type="button"
                          onClick={addOption}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          + Add Option
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.options.map((opt, index) => (
                          <div key={index} className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-xs font-mono text-slate-400 w-5 flex-shrink-0">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 rounded bg-slate-700 border border-slate-600 px-2 py-1.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xs"
                                placeholder={`Option ${index + 1}`}
                              />
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={formData.correctAnswer === String(index)}
                                onChange={() => setFormData({ ...formData, correctAnswer: String(index) })}
                                className="w-3.5 h-3.5 text-blue-600 bg-slate-700 border-slate-500 focus:ring-blue-500 flex-shrink-0"
                                title="Mark as correct answer"
                              />
                              {formData.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            {/* Option Image */}
                            <div className="flex items-center gap-1.5 ml-6">
                              <input
                                type="text"
                                value={formData.optionImages[index] || ""}
                                onChange={(e) => {
                                  const newOptImages = [...formData.optionImages];
                                  newOptImages[index] = e.target.value;
                                  setFormData({ ...formData, optionImages: newOptImages });
                                }}
                                className="flex-1 rounded bg-slate-800 border border-slate-600 px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-[10px]"
                                placeholder="Image URL (optional)"
                              />
                              <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded px-1.5 py-1 text-[10px] text-slate-300 transition-all flex items-center gap-1 flex-shrink-0">
                                {uploadingOptionImage === index ? "..." : "Img"}
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files[0]) handleOptionImageUpload(e.target.files[0], index);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                              {formData.optionImages[index] && (
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={formData.optionImages[index]}
                                    alt=""
                                    className="w-6 h-6 rounded object-cover border border-slate-500"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => clearOptionImage(index)}
                                    className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center text-white text-[6px] hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">Select radio button ✓ for the correct answer. You can add an image per option.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm text-white font-medium transition-all"
                >
                  {editingQ ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

