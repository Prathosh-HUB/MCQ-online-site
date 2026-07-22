"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/students", label: "Students", icon: "👥" },
  { href: "/admin/question-set", label: "Question Sets", icon: "📚" },
  { href: "/admin/question", label: "Questions", icon: "❓" },
  { href: "/admin/results", label: "Results", icon: "📈" },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose}></div>
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="text-white font-bold">Admin Panel</h2>
              <p className="text-xs text-slate-400">MCQ Interview</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}

