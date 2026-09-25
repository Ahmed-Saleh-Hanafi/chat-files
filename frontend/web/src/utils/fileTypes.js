import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Music,
  Video,
  File as FileIcon,
  Link as LinkIcon,
} from "lucide-react";

const EXTENSION_MAP = {
  pdf: { icon: FileText, className: "text-red-400 bg-red-500/10" },
  doc: { icon: FileText, className: "text-blue-400 bg-blue-500/10" },
  docx: { icon: FileText, className: "text-blue-400 bg-blue-500/10" },
  txt: { icon: FileText, className: "text-base-300 bg-base-600/20" },
  xlsx: { icon: FileSpreadsheet, className: "text-emerald-400 bg-emerald-500/10" },
  xls: { icon: FileSpreadsheet, className: "text-emerald-400 bg-emerald-500/10" },
  csv: { icon: FileSpreadsheet, className: "text-emerald-400 bg-emerald-500/10" },
  png: { icon: ImageIcon, className: "text-violet-400 bg-violet-500/10" },
  jpg: { icon: ImageIcon, className: "text-violet-400 bg-violet-500/10" },
  jpeg: { icon: ImageIcon, className: "text-violet-400 bg-violet-500/10" },
  gif: { icon: ImageIcon, className: "text-violet-400 bg-violet-500/10" },
  webp: { icon: ImageIcon, className: "text-violet-400 bg-violet-500/10" },
  mp3: { icon: Music, className: "text-amber-400 bg-amber-500/10" },
  wav: { icon: Music, className: "text-amber-400 bg-amber-500/10" },
  m4a: { icon: Music, className: "text-amber-400 bg-amber-500/10" },
  mp4: { icon: Video, className: "text-pink-400 bg-pink-500/10" },
  mov: { icon: Video, className: "text-pink-400 bg-pink-500/10" },
  webm: { icon: Video, className: "text-pink-400 bg-pink-500/10" },
  url: { icon: LinkIcon, className: "text-accent-400 bg-accent-500/10" },
};

export function getFileMeta(name = "", type = "") {
  if (type === "url") return EXTENSION_MAP.url;
  const ext = name.split(".").pop()?.toLowerCase();
  return EXTENSION_MAP[ext] || { icon: FileIcon, className: "text-base-300 bg-base-600/20" };
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
