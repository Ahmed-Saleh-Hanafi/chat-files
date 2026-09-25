import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Settings,
  HelpCircle,
  FilePlus2,
  Search,
  Folder,
  X,
  FilesIcon,
} from "lucide-react";
import Avatar from "../common/Avatar.jsx";
import DropdownMenu from "../common/DropdownMenu.jsx";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

function NavItem({ to, icon: Icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-accent-600/15 text-accent-400"
            : "text-base-300 hover:bg-base-800 hover:text-base-100"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function LeftSidebar({ projects = [], onNewProject, onClose, isDrawer = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 200);

  const filtered = debounced
    ? projects.filter((p) => p.name.toLowerCase().includes(debounced.toLowerCase()))
    : projects;

  return (
    <aside className="flex h-full w-72 flex-col border-r border-base-700 bg-base-900 px-3 py-4">
      <div className="mb-5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-white">
            <FilesIcon size={17} />
          </div>
          <span className="text-base font-bold tracking-tight text-base-100">ChatFiles</span>
        </div>
        {isDrawer && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-base-400 hover:bg-base-800"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        <NavItem to="/app/dashboard" icon={LayoutGrid} label="Dashboard" end />
        <NavItem to="/app/settings" icon={Settings} label="Settings" />
        <NavItem to="/app/help" icon={HelpCircle} label="Help" />
      </nav>

      <button
        onClick={onNewProject}
        className="btn-primary mt-4 w-full justify-start"
      >
        <FilePlus2 size={17} />
        New project
      </button>

      <div className="mt-6 flex flex-1 flex-col overflow-hidden">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-base-400">
            Recent projects
          </p>
        </div>
        <div className="relative mb-2 px-0.5">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full rounded-lg border border-base-700 bg-base-850 py-1.5 pl-8 pr-2 text-xs text-base-200 placeholder-base-500 outline-none focus:border-accent-500"
          />
        </div>

        <div className="flex-1 space-y-0.5 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="px-2 py-3 text-xs text-base-500">No projects found.</p>
          )}
          {filtered.map((project) => (
            <NavLink
              key={project.id}
              to={`/app/projects/${project.id}`}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-base-800 text-base-100"
                    : "text-base-300 hover:bg-base-800/70 hover:text-base-100"
                }`
              }
            >
              <Folder size={16} className="shrink-0 text-base-400" />
              <span className="flex-1 truncate">{project.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-3 border-t border-base-700 pt-3">
        <DropdownMenu
          align="left"
          trigger={
            <div className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-base-800">
              <Avatar name={user?.username || user?.email} src={user?.avatarUrl} size={34} />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-base-100">
                  {user?.username || "Your account"}
                </p>
                <p className="truncate text-xs text-base-400">{user?.email}</p>
              </div>
            </div>
          }
          items={[
            { label: "Profile", onClick: () => navigate("/app/settings") },
            { label: "Settings", onClick: () => navigate("/app/settings") },
            { label: "Usage", onClick: () => navigate("/app/settings?tab=usage") },
            { label: "Help", onClick: () => navigate("/app/help") },
            { divider: true },
            { label: "Log out", danger: true, onClick: logout },
          ]}
        />
      </div>
    </aside>
  );
}
