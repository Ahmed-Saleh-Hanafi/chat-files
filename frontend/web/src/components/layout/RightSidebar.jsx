import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, UploadCloud, MessageSquarePlus, ChevronRight, Search, X } from "lucide-react";
import FileItem from "../project/FileItem.jsx";
import DropdownMenu from "../common/DropdownMenu.jsx";
import useProject from "../../hooks/useProject";
import useDebounce from "../../hooks/useDebounce";
import { formatRelativeTime } from "../../utils/formatDate";
import { MessageSquare } from "lucide-react";

export default function RightSidebar({
  onUploadClick,
  onNewChat,
  onRenameConversation,
  onArchiveConversation,
  onDeleteConversation,
  onClose,
  isDrawer = false,
}) {
  const navigate = useNavigate();
  const { project, sources, conversations, projectId } = useProject();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 200);

  const filteredChats = debounced
    ? conversations.filter((c) => c.title?.toLowerCase().includes(debounced.toLowerCase()))
    : conversations;

  if (!project) {
    return (
      <aside className="flex h-full w-80 flex-col items-center justify-center border-l border-base-700 bg-base-900 px-4 text-center text-sm text-base-500">
        Select or create a project to see its details here.
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 flex-col border-l border-base-700 bg-base-900 px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-base-400">
          Current project
        </p>
        {isDrawer && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-base-400 hover:bg-base-800"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <h2 className="mb-3 truncate text-lg font-semibold text-base-100">{project.name}</h2>

      <button
        onClick={() => navigate(`/app/projects/${projectId}/settings`)}
        className="mb-2 flex items-center justify-between rounded-lg border border-base-700 bg-base-850 px-3 py-2.5 text-sm text-base-200 hover:bg-base-800"
      >
        <span className="flex items-center gap-2">
          <Settings size={15} className="text-base-400" />
          Project settings
        </span>
        <ChevronRight size={15} className="text-base-500" />
      </button>

      <button onClick={onUploadClick} className="btn-primary mb-5 w-full">
        <UploadCloud size={17} />
        Upload file
      </button>

      <div className="mb-5 flex flex-1 flex-col overflow-hidden">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-400">
            Recent files
          </p>
          <span className="text-xs text-base-500">{sources.length}</span>
        </div>
        <div className="max-h-52 flex-1 space-y-1 overflow-y-auto pr-1">
          {sources.length === 0 && (
            <p className="px-1 py-3 text-xs text-base-500">
              No files yet. Upload something to get started.
            </p>
          )}
          {sources.slice(0, 8).map((source) => (
            <FileItem
              key={source.id}
              source={source}
              onClick={() => navigate(`/app/projects/${projectId}/sources/${source.id}`)}
            />
          ))}
        </div>
      </div>

      <button onClick={onNewChat} className="btn-secondary mb-3 w-full justify-start">
        <MessageSquarePlus size={17} />
        New chat
        <span className="ml-auto text-base-500">+</span>
      </button>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-400">
            Recent chats
          </p>
        </div>
        <div className="relative mb-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full rounded-lg border border-base-700 bg-base-850 py-1.5 pl-7 pr-2 text-xs text-base-200 placeholder-base-500 outline-none focus:border-accent-500"
          />
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto pr-1">
          {filteredChats.length === 0 && (
            <p className="px-1 py-3 text-xs text-base-500">No conversations yet.</p>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/app/projects/${projectId}/chat/${chat.id}`)}
              className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-base-300 hover:bg-base-800 hover:text-base-100"
            >
              <MessageSquare size={15} className="shrink-0 text-base-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate">{chat.title || "New conversation"}</p>
                <p className="text-xs text-base-500">{formatRelativeTime(chat.updatedAt)}</p>
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100"
              >
                <DropdownMenu
                  items={[
                    { label: "Rename", onClick: () => onRenameConversation?.(chat) },
                    { label: "Archive", onClick: () => onArchiveConversation?.(chat) },
                    { divider: true },
                    {
                      label: "Delete",
                      danger: true,
                      onClick: () => onDeleteConversation?.(chat),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
