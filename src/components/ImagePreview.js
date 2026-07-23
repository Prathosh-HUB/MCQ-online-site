"use client";

import { useState } from "react";

export default function ImagePreview({ src, alt, className, children }) {
  const [showPreview, setShowPreview] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleMouseEnter = () => {
    setIsLeaving(false);
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setIsLeaving(true);
    // Wait for zoom-out animation to complete before hiding
    setTimeout(() => {
      setIsLeaving(false);
      setShowPreview(false);
    }, 250);
  };

  return (
    <>
      <div
        className="inline-block cursor-zoom-in transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 hover:brightness-110 active:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children || (
          <img src={src} alt={alt || ""} className={className} onError={(e) => { e.target.style.display = "none"; }} />
        )}
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 pointer-events-none"
          style={{
            animation: isLeaving
              ? "previewFadeOut 0.25s ease-in forwards"
              : "previewFadeIn 0.3s ease-out forwards",
          }}
        >
          <img
            src={src}
            alt={alt || "Preview"}
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
            style={{
              animation: isLeaving
                ? "previewZoomOut 0.25s ease-in forwards"
                : "previewZoomIn 0.3s ease-out forwards",
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes previewFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes previewFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes previewZoomIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes previewZoomOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.85);
          }
        }
      `}</style>
    </>
  );
}

