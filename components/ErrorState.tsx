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
      className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center max-w-md mx-auto"
    >
      <div className="text-4xl mb-3" aria-hidden="true">
        ⚠️
      </div>
      <p className="font-semibold text-gray-900 text-base mb-1">Something went wrong</p>
      <p className="text-sm text-gray-600 mb-4">{message}</p>

      {code && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <code className="bg-white border border-red-200 rounded px-2 py-1 text-xs text-gray-700 font-mono">
            {code}
          </code>
          <button
            onClick={copyCode}
            className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
