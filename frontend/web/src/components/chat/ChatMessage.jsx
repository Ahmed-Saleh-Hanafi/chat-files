import { useState } from "react";
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, Check, Bot } from "lucide-react";
import Avatar from "../common/Avatar.jsx";
import useAuth from "../../hooks/useAuth";

function CitationChip({ citation, onClick }) {
  return (
    <button
      onClick={() => onClick?.(citation)}
      className="inline-flex items-center gap-1 rounded-md border border-base-600 bg-base-800 px-2 py-0.5 text-xs font-medium text-accent-400 transition-colors hover:border-accent-500 hover:bg-accent-500/10"
    >
      [{citation.index}] {citation.sourceName}
      {citation.page ? ` — Page ${citation.page}` : ""}
    </button>
  );
}

export default function ChatMessage({
  message,
  onCitationClick,
  onRegenerate,
  onFeedback,
  isStreaming = false,
}) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(message.feedback || null);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFeedback = (rating) => {
    setFeedback(rating);
    onFeedback?.(message, rating);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 px-4 py-2">
        <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-base-800 px-4 py-2.5 text-sm text-base-100">
          {message.content}
        </div>
        <Avatar name={user?.username} src={user?.avatarUrl} size={30} />
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white">
        <Bot size={16} />
      </div>
      <div className="max-w-[75%] min-w-0">
        <div className="rounded-2xl rounded-tl-sm bg-base-850 px-4 py-3 text-sm leading-relaxed text-base-100">
          <p className="whitespace-pre-wrap">
            {message.content}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-accent-400" />
            )}
          </p>

          {message.citations?.length > 0 && (
            <div className="mt-3 border-t border-base-700 pt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-base-400">
                Sources
              </p>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((c) => (
                  <CitationChip key={c.index} citation={c} onClick={onCitationClick} />
                ))}
              </div>
            </div>
          )}
        </div>

        {!isStreaming && (
          <div className="mt-1.5 flex items-center gap-1 px-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md p-1.5 text-xs text-base-500 hover:bg-base-800 hover:text-base-200"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => onRegenerate?.(message)}
              className="flex items-center gap-1 rounded-md p-1.5 text-xs text-base-500 hover:bg-base-800 hover:text-base-200"
            >
              <RotateCcw size={14} />
              Regenerate
            </button>
            <button
              onClick={() => handleFeedback("up")}
              className={`rounded-md p-1.5 hover:bg-base-800 ${
                feedback === "up" ? "text-emerald-400" : "text-base-500 hover:text-base-200"
              }`}
              aria-label="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => handleFeedback("down")}
              className={`rounded-md p-1.5 hover:bg-base-800 ${
                feedback === "down" ? "text-red-400" : "text-base-500 hover:text-base-200"
              }`}
              aria-label="Bad response"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
