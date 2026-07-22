"use client";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", variant = "danger" }) {
  if (!isOpen) return null;

  const confirmColor = variant === "danger"
    ? "bg-red-600 hover:bg-red-700"
    : variant === "warning"
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className={`text-5xl mb-4 ${variant === "danger" ? "text-red-400" : variant === "warning" ? "text-amber-400" : "text-blue-400"}`}>
            {variant === "danger" ? "⚠️" : variant === "warning" ? "📋" : "ℹ️"}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 mb-6">{message}</p>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

