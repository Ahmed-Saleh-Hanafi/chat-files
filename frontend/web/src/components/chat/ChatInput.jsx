import { useRef, useState } from "react";
import { Plus, Mic, ArrowUp, UploadCloud, Link as LinkIcon, ListChecks } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";

export default function ChatInput({ onSend, onUploadClick, onSelectSources, disabled }) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const textareaRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const autoGrow = (e) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-base-700 bg-base-950 px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-base-600 bg-base-900 px-2 py-2 focus-within:border-accent-500">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base-300 hover:bg-base-800 hover:text-base-100"
            aria-label="Add attachment"
          >
            <Plus size={19} />
          </button>
          {menuOpen && (
            <div className="animate-in absolute bottom-11 left-0 w-48 overflow-hidden rounded-lg border border-base-600 bg-base-850 py-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onUploadClick?.();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-base-200 hover:bg-base-700"
              >
                <UploadCloud size={15} /> Upload file
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onUploadClick?.();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-base-200 hover:bg-base-700"
              >
                <LinkIcon size={15} /> Add URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onSelectSources?.();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-base-200 hover:bg-base-700"
              >
                <ListChecks size={15} /> Select sources
              </button>
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={autoGrow}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your knowledge..."
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-base-100 placeholder-base-500 outline-none"
        />

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base-300 hover:bg-base-800 hover:text-base-100"
          aria-label="Voice input (coming soon)"
          title="Voice input — coming soon"
        >
          <Mic size={18} />
        </button>

        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white transition-colors hover:bg-accent-500 disabled:bg-base-700 disabled:text-base-500"
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-base-500">
        ChatFiles answers are grounded in your uploaded sources and may still make mistakes.
      </p>
    </form>
  );
}
