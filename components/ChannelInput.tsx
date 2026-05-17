"use client";

import { useState } from "react";

interface ChannelInputProps {
  onSubmit: (channelUrl: string) => void;
  isLoading?: boolean;
}

const EXAMPLES = [
  "https://youtube.com/@MrBeast",
  "https://youtube.com/channel/UCxxxxxx",
  "@YourHandle",
  "UCxxxxxx",
];

export function ChannelInput({ onSubmit, isLoading = false }: ChannelInputProps) {
  const [error, setError] = useState("");

  function handleAction(formData: FormData) {
    const trimmed = (formData.get("channelUrl") as string | null)?.trim() ?? "";
    if (!trimmed) {
      setError("Please enter a YouTube channel URL or handle.");
      return;
    }
    setError("");
    onSubmit(trimmed);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form action={handleAction} noValidate>
        <label htmlFor="channel-input" className="block text-sm font-medium text-zinc-400 mb-2">
          YouTube Channel URL or Handle
        </label>
        <div className="flex gap-3">
          <input
            id="channel-input"
            name="channelUrl"
            type="text"
            onChange={() => {
              if (error) setError("");
            }}
            placeholder="https://youtube.com/@channel or @handle"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-describedby={error ? "channel-input-error" : "channel-input-hint"}
            className={[
              "flex-1 rounded-xl border px-4 py-3 text-sm text-zinc-50 bg-zinc-900",
              "placeholder:text-zinc-600",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150",
              error ? "border-rose-400 bg-rose-950/20" : "border-zinc-800 hover:border-zinc-700",
            ].join(" ")}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={[
              "rounded-xl px-6 py-3 text-sm font-medium text-black",
              "bg-white hover:bg-zinc-200",
              "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150",
            ].join(" ")}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing…
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>

        {error && (
          <p id="channel-input-error" role="alert" className="mt-2 text-xs text-rose-400">
            {error}
          </p>
        )}
      </form>

      <div
        id="channel-input-hint"
        className="mt-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800"
      >
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-zinc-400 font-medium">Supported formats:</span>
          <span className="block mt-2 space-x-2">
            {EXAMPLES.map((ex) => (
              <code key={ex} className="inline-block bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                {ex}
              </code>
            ))}
          </span>
        </p>
      </div>
    </div>
  );
}
