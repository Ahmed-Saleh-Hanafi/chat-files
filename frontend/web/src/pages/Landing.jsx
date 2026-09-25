import { Link } from "react-router-dom";
import {
  FilesIcon,
  Upload,
  MessageSquare,
  Quote,
  ShieldCheck,
  FileText,
  Globe,
  Image as ImageIcon,
  Music,
  Video,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const FEATURES = [
  {
    icon: Upload,
    title: "One upload, every conversation",
    description: "Add your files once. Every future question draws on the same project knowledge — no re-uploading.",
  },
  {
    icon: MessageSquare,
    title: "Chat like you already do",
    description: "A familiar, fast chat interface built around your documents instead of the open internet.",
  },
  {
    icon: Quote,
    title: "Answers you can verify",
    description: "Every answer links back to the exact passage it came from, so you never have to take it on faith.",
  },
  {
    icon: ShieldCheck,
    title: "Your knowledge stays yours",
    description: "Projects are private by default and never mixed with anyone else's data.",
  },
];

const SOURCES = [
  { icon: FileText, label: "PDF" },
  { icon: FileText, label: "DOCX" },
  { icon: FileSpreadsheet, label: "XLSX / CSV" },
  { icon: ImageIcon, label: "Images" },
  { icon: Music, label: "Audio" },
  { icon: Video, label: "Video" },
  { icon: Globe, label: "URLs" },
];

const STEPS = [
  { title: "Create a project", description: "Give it a name and tell the AI what you're trying to do." },
  { title: "Add your sources", description: "Drag in documents, links, images, audio, or video." },
  { title: "Ask anything", description: "ChatFiles retrieves the relevant pieces and answers with citations." },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For trying ChatFiles out on a couple of projects.",
    features: ["2 projects", "50 MB of sources per project", "100 messages / month", "Standard citations"],
  },
  {
    name: "Pro",
    price: "$15",
    period: "per month",
    description: "For individuals working across ongoing projects.",
    features: ["Unlimited projects", "5 GB of sources per project", "Unlimited messages", "Priority processing"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "Custom",
    period: "billed annually",
    description: "For teams sharing knowledge across projects.",
    features: ["Everything in Pro", "Shared team projects", "Admin & access controls", "Dedicated support"],
  },
];

const FAQS = [
  {
    q: "What file types can I upload?",
    a: "PDF, Word, plain text, spreadsheets and CSVs, images, audio, and video — plus web links you want indexed.",
  },
  {
    q: "How are answers grounded in my files?",
    a: "ChatFiles retrieves the most relevant passages from your sources for each question and cites exactly where each part of the answer came from.",
  },
  {
    q: "Is my data shared between projects?",
    a: "No. Each project's knowledge is kept separate, and the AI only draws on the sources you've added to that specific project.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — you can downgrade or delete your account at any time from Settings.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-base-700 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-base-100"
      >
        {q}
        <ChevronDown size={16} className={`text-base-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="mt-2 text-sm text-base-400">{a}</p>}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-base-950 text-base-100">
      <header className="sticky top-0 z-20 border-b border-base-800 bg-base-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white">
              <FilesIcon size={17} />
            </div>
            <span className="text-base font-bold tracking-tight">ChatFiles</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Start for free
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-base-100 sm:text-5xl">
          Chat with your knowledge, not just the internet
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-base-400">
          Create a project, add your documents and links once, and keep asking questions —
          grounded in your own sources, with citations you can check.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3 text-sm">
            Start for free
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-sm">
            Sign in
          </Link>
        </div>

        <div className="card mx-auto mt-14 max-w-3xl overflow-hidden text-left shadow-2xl">
          <div className="flex items-center gap-2 border-b border-base-700 bg-base-900 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-xs text-base-500">Graduation Project — ChatFiles</span>
          </div>
          <div className="space-y-3 bg-base-850 p-5">
            <div className="ml-auto max-w-[70%] rounded-2xl rounded-tr-sm bg-base-800 px-4 py-2.5 text-sm text-base-200">
              What are the three main components of the proposed architecture?
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-base-900 px-4 py-2.5 text-sm text-base-200">
              The proposed architecture consists of three main components: ingestion, retrieval,
              and generation.
              <div className="mt-2 flex gap-1.5">
                <span className="rounded-md border border-base-600 bg-base-800 px-2 py-0.5 text-xs text-accent-400">
                  [1] architecture.pdf — Page 7
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-base-800 bg-base-900/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-semibold text-base-100">
            Built around how you actually research
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600/15 text-accent-400">
                  <f.icon size={19} />
                </div>
                <h3 className="text-sm font-semibold text-base-100">{f.title}</h3>
                <p className="mt-1.5 text-sm text-base-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-semibold text-base-100">Supported sources</h2>
          <p className="mt-2 text-sm text-base-400">Bring whatever knowledge you already have.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SOURCES.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-full border border-base-700 bg-base-850 px-4 py-2 text-sm text-base-300"
              >
                <s.icon size={15} className="text-accent-400" />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-base-800 bg-base-900/40 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-2xl font-semibold text-base-100">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent-600 text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-base-100">{step.title}</h3>
                <p className="mt-1.5 text-sm text-base-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ShieldCheck size={28} className="mx-auto mb-4 text-accent-400" />
          <h2 className="text-2xl font-semibold text-base-100">Private by design</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-base-400">
            Your projects and sources are isolated from other users and other projects. You choose
            what to upload, and you can delete any source or project at any time.
          </p>
        </div>
      </section>

      <section className="border-t border-base-800 bg-base-900/40 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold text-base-100">Simple pricing</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`card flex flex-col p-6 ${plan.highlighted ? "border-accent-500 ring-1 ring-accent-500/40" : ""}`}
              >
                <h3 className="text-sm font-semibold text-base-100">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-base-100">{plan.price}</span>
                  <span className="text-xs text-base-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-base-400">{plan.description}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-base-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`mt-6 text-center text-sm ${plan.highlighted ? "btn-primary" : "btn-secondary"}`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-2xl font-semibold text-base-100">Frequently asked questions</h2>
          <div className="mt-8">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-base-800 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-base-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-600 text-white">
              <FilesIcon size={13} />
            </div>
            <span className="font-semibold text-base-300">ChatFiles</span>
          </div>
          <p>© {new Date().getFullYear()} ChatFiles. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-base-300">
              Privacy
            </a>
            <a href="#" className="hover:text-base-300">
              Terms
            </a>
            <a href="#" className="hover:text-base-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
