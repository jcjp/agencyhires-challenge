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
        <label htmlFor="channel-input" className="block text-sm font-medium text-gray-700 mb-1.5">
          YouTube Channel URL or Handle
        </label>
        <div className="flex gap-2">
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
              "flex-1 rounded-lg border px-4 py-2.5 text-sm text-black shadow-sm",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white",
            ].join(" ")}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={[
              "rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm",
              "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
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
          <p id="channel-input-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
      </form>

      <p id="channel-input-hint" className="mt-3 text-xs text-gray-500">
        <span className="font-medium">Supported formats: </span>
        {EXAMPLES.map((ex, i) => (
          <span key={ex}>
            <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">{ex}</code>
            {i < EXAMPLES.length - 1 && ", "}
          </span>
        ))}
      </p>
    </div>
  );
}
