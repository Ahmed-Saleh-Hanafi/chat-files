import { Loader2, AlertCircle } from "lucide-react";
import DropdownMenu from "../common/DropdownMenu.jsx";
import { getFileMeta } from "../../utils/fileTypes";
import { Eye, Pencil, Download, Info, RefreshCcw, Trash2 } from "lucide-react";

export default function FileItem({ source, onClick, onRename, onDownload, onDetails, onReprocess, onDelete }) {
  const { icon: Icon, className } = getFileMeta(source.name, source.sourceType);
  const isProcessing = source.status && !["ready", "failed"].includes(source.status);
  const isFailed = source.status === "failed";

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm hover:bg-base-800"
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${className}`}>
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base-200">{source.name}</p>
        {isProcessing && (
          <p className="flex items-center gap-1 text-xs text-accent-400">
            <Loader2 size={11} className="animate-spin" />
            {source.status}
          </p>
        )}
        {isFailed && (
          <p className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle size={11} />
            Processing failed
          </p>
        )}
      </div>
      <div onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100">
        <DropdownMenu
          items={[
            { label: "Open", icon: Eye, onClick: onClick },
            { label: "Rename", icon: Pencil, onClick: () => onRename?.(source) },
            { label: "Download", icon: Download, onClick: () => onDownload?.(source) },
            { label: "View details", icon: Info, onClick: () => onDetails?.(source) },
            { label: "Reprocess", icon: RefreshCcw, onClick: () => onReprocess?.(source) },
            { divider: true },
            { label: "Delete", icon: Trash2, danger: true, onClick: () => onDelete?.(source) },
          ]}
        />
      </div>
    </div>
  );
}
