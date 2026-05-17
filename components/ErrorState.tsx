"use client";

import { useState } from "react";

interface ErrorStateProps {
  message: string;
  code?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, code, onRetry }: ErrorStateProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-900/50 bg-rose-950/20 backdrop-blur-sm px-8 py-12 text-center max-w-lg mx-auto"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="font-semibold text-zinc-50 text-lg mb-2 tracking-tight">Analysis Failed</p>
      <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-sm mx-auto">{message}</p>

      {code && (
        <div className="flex items-center justify-center gap-3 mb-6">
          <code className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-rose-400 font-mono">
            {code}
          </code>
          <button
            onClick={copyCode}
            className="text-xs text-zinc-500 hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg px-2 py-1 transition-colors"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all duration-150"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
