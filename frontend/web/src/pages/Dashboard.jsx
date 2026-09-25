import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, FolderOpen, FileText, MessageSquare } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useProjectList from "../hooks/useProjectList";
import useDebounce from "../hooks/useDebounce";
import useToast from "../hooks/useToast";
import DropdownMenu from "../components/common/DropdownMenu.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import Spinner from "../components/common/Spinner.jsx";
import NewProjectModal from "../components/project/NewProjectModal.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import { formatRelativeTime } from "../utils/formatDate";
import projectApi from "../api/projectApi";

function ProjectCard({ project, onOpen, onDelete }) {
  return (
    <div
      onClick={onOpen}
      className="card group flex cursor-pointer flex-col p-5 transition-colors hover:border-base-500"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600/15 text-accent-400">
          <FolderOpen size={19} />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu
            items={[
              { label: "Open", onClick: onOpen },
              { divider: true },
              { label: "Delete", danger: true, onClick: onDelete },
            ]}
          />
        </div>
      </div>
      <h3 className="truncate text-base font-semibold text-base-100">{project.name}</h3>
      {project.goal && <p className="mt-1 line-clamp-2 text-sm text-base-400">{project.goal}</p>}

      <div className="mt-4 flex items-center gap-4 text-xs text-base-500">
        <span className="flex items-center gap-1.5">
          <FileText size={13} /> {project.sourceCount ?? 0} Sources
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare size={13} /> {project.conversationCount ?? 0} Conversations
        </span>
      </div>
      <p className="mt-3 text-xs text-base-500">Updated {formatRelativeTime(project.updatedAt)}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="btn-secondary mt-4 w-full justify-center text-sm opacity-0 transition-opacity group-hover:opacity-100"
      >
        Open
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, status, upsertProject, removeProject } = useProjectList();
  const navigate = useNavigate();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 200);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = debounced
    ? projects.filter((p) => p.name.toLowerCase().includes(debounced.toLowerCase()))
    : projects;

  const handleCreate = async (payload) => {
    const project = await projectApi.create(payload);
    upsertProject(project);
    toast.success("Project created successfully.");
    setNewProjectOpen(false);
    navigate(`/app/projects/${project.id}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await projectApi.remove(deleteTarget.id);
      removeProject(deleteTarget.id);
      toast.success("Project deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Couldn't delete the project.");
    } finally {
      setDeleting(false);
    }
  };

  const firstName = user?.username?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-base-100">Hi {firstName}, how can I help you?</h1>
        <p className="mt-1.5 text-sm text-base-400">
          Upload your knowledge, create a project, and start asking questions.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={() => setNewProjectOpen(true)} className="btn-primary">
            <Plus size={17} />
            New project
          </button>
          {projects[0] && (
            <button
              onClick={() => navigate(`/app/projects/${projects[0].id}`)}
              className="btn-secondary"
            >
              <FolderOpen size={17} />
              Open recent project
            </button>
          )}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="field-input pl-9"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-base-400">
            Recent projects
          </h2>

          {status === "loading" && projects.length === 0 ? (
            <div className="flex justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title={query ? "No projects match your search." : "No projects yet."}
              description={!query && "Create your first project to start chatting with your knowledge."}
              action={
                !query && (
                  <button onClick={() => setNewProjectOpen(true)} className="btn-primary mt-2">
                    <Plus size={16} /> New Project
                  </button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => navigate(`/app/projects/${project.id}`)}
                  onDelete={() => setDeleteTarget(project)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <NewProjectModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this project?"
        description={`This permanently deletes "${deleteTarget?.name}" and all of its sources and conversations.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
