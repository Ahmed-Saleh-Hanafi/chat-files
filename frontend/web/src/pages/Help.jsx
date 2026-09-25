import { useState } from "react";
import { BookOpen, HelpCircle, LifeBuoy, Flag, Keyboard, ChevronDown, Send } from "lucide-react";
import useToast from "../hooks/useToast";
import Button from "../components/common/Button.jsx";

const FAQS = [
  {
    q: "How do I add a source to a project?",
    a: "Open a project, click Upload file in the right sidebar, then drag files in or paste a URL.",
  },
  {
    q: "Why is my file stuck processing?",
    a: "Large files or media can take a few minutes to transcribe and index. If it's stuck for a long time, try Reprocess from the file's menu.",
  },
  {
    q: "Can I see where an answer came from?",
    a: "Yes — click any citation under an AI answer to open the source with the relevant passage highlighted.",
  },
  {
    q: "How do I remove a source from a project?",
    a: "Open the file's three-dot menu and choose Delete. This removes it from the project's knowledge.",
  },
];

const SHORTCUTS = [
  { keys: "Ctrl / Cmd + K", action: "Search projects" },
  { keys: "Ctrl / Cmd + N", action: "New chat" },
  { keys: "Enter", action: "Send message" },
  { keys: "Shift + Enter", action: "New line in message" },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-base-700 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-base-100"
      >
        {q}
        <ChevronDown size={15} className={`text-base-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="mt-2 text-sm text-base-400">{a}</p>}
    </div>
  );
}

export default function Help() {
  const toast = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      // In production, wire this to a support endpoint.
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Message sent. Our team will get back to you soon.");
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-bold text-base-100">Help center</h1>
        <p className="mt-1.5 text-sm text-base-400">
          Find answers, report a problem, or get in touch with our team.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a href="#faq" className="card flex flex-col items-start gap-2 p-4 hover:border-base-500">
            <BookOpen size={18} className="text-accent-400" />
            <p className="text-sm font-medium text-base-100">Documentation</p>
            <p className="text-xs text-base-400">Guides on projects, sources, and chat.</p>
          </a>
          <a href="#shortcuts" className="card flex flex-col items-start gap-2 p-4 hover:border-base-500">
            <Keyboard size={18} className="text-accent-400" />
            <p className="text-sm font-medium text-base-100">Keyboard shortcuts</p>
            <p className="text-xs text-base-400">Move faster through ChatFiles.</p>
          </a>
          <a href="#contact" className="card flex flex-col items-start gap-2 p-4 hover:border-base-500">
            <Flag size={18} className="text-accent-400" />
            <p className="text-sm font-medium text-base-100">Report a problem</p>
            <p className="text-xs text-base-400">Tell us what went wrong.</p>
          </a>
        </div>

        <section id="faq" className="card mt-8 p-6">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-base-100">
            <HelpCircle size={16} className="text-accent-400" />
            Frequently asked questions
          </h2>
          <div className="mt-3">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </section>

        <section id="shortcuts" className="card mt-6 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-base-100">
            <Keyboard size={16} className="text-accent-400" />
            Keyboard shortcuts
          </h2>
          <div className="space-y-2">
            {SHORTCUTS.map((s) => (
              <div key={s.action} className="flex items-center justify-between text-sm">
                <span className="text-base-400">{s.action}</span>
                <kbd className="rounded border border-base-600 bg-base-900 px-2 py-0.5 text-xs text-base-300">
                  {s.keys}
                </kbd>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="card mt-6 p-6">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-base-100">
            <LifeBuoy size={16} className="text-accent-400" />
            Contact support
          </h2>
          <p className="mb-3 text-sm text-base-400">
            Describe the issue and we’ll follow up by email.
          </p>
          <form onSubmit={handleContact} className="space-y-3">
            <textarea
              className="field-input min-h-[100px] resize-none"
              placeholder="What's going on?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={sending}>
                <Send size={15} />
                Send message
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
