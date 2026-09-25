import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Database, Trash2, HardDrive, Loader2 } from "lucide-react";
import useProject from "../hooks/useProject";
import useProjectList from "../hooks/useProjectList";
import useToast from "../hooks/useToast";
import Button from "../components/common/Button.jsx";
import Field from "../components/common/Field.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import Spinner from "../components/common/Spinner.jsx";
import projectApi from "../api/projectApi";
import { formatFullDate } from "../utils/formatDate";
import { formatBytes } from "../utils/fileTypes";
import { normalizeError } from "../api/client";

export default function ProjectSettings() {
  const { project, projectId, setProject, sources } = useProject();
  const { upsertProject, removeProject } = useProjectList();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ name: "", goal: "", aiInstructions: "" });
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [knowledge, setKnowledge] = useState(null);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        goal: project.goal || "",
        aiInstructions: project.aiInstructions || "",
      });
    }
  }, [project]);

  useEffect(() => {
    if (!projectId) return;
    projectApi
      .getKnowledgeStats(projectId)
      .then(setKnowledge)
      .catch(() => setKnowledge(null));
  }, [projectId]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await projectApi.update(projectId, form);
      setProject((p) => ({ ...p, ...updated }));
      upsertProject(updated);
      toast.success("Changes saved successfully.");
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await projectApi.remove(projectId);
      removeProject(projectId);
      toast.success("Project deleted.");
      navigate("/app/dashboard");
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't delete the project.");
      setDeleting(false);
    }
  };

  if (!project) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  const readyCount = sources.filter((s) => s.status === "ready").length;
  const processingCount = sources.filter((s) => s.status && !["ready", "failed"].includes(s.status)).length;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(`/app/projects/${projectId}`)}
          className="mb-6 flex items-center gap-1.5 text-sm text-base-400 hover:text-base-100"
        >
          <ArrowLeft size={15} /> Back to project
        </button>

        <h1 className="text-xl font-bold text-base-100">Project settings</h1>

        <section className="card mt-6 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-base-400">General</h2>
          <div className="mt-4 space-y-4">
            <Field label="Project name" value={form.name} onChange={update("name")} />
            <div>
              <label className="field-label">Project goal</label>
              <textarea
                className="field-input min-h-[72px] resize-none"
                value={form.goal}
                onChange={update("goal")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-base-400">
              <div>
                <p className="text-xs text-base-500">Created</p>
                <p>{formatFullDate(project.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-base-500">Last updated</p>
                <p>{formatFullDate(project.updatedAt)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card mt-6 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-base-400">
            AI instructions
          </h2>
          <p className="mt-1 text-sm text-base-400">
            Define how the AI should respond within this project.
          </p>
          <textarea
            className="field-input mt-3 min-h-[96px] resize-none"
            placeholder="Explain technical concepts clearly and cite the source whenever possible."
            value={form.aiInstructions}
            onChange={update("aiInstructions")}
          />
        </section>

        <section className="card mt-6 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-base-400">Knowledge</h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-base-700 bg-base-900 p-3 text-center">
              <p className="text-lg font-semibold text-base-100">{sources.length}</p>
              <p className="text-xs text-base-500">Sources</p>
            </div>
            <div className="rounded-lg border border-base-700 bg-base-900 p-3 text-center">
              <p className="flex items-center justify-center gap-1 text-lg font-semibold text-base-100">
                {processingCount > 0 && <Loader2 size={14} className="animate-spin text-accent-400" />}
                {readyCount}
              </p>
              <p className="text-xs text-base-500">Ready</p>
            </div>
            <div className="rounded-lg border border-base-700 bg-base-900 p-3 text-center">
              <p className="flex items-center justify-center gap-1 text-lg font-semibold text-base-100">
                <HardDrive size={14} className="text-base-500" />
                {formatBytes(knowledge?.storageUsedBytes ?? 0)}
              </p>
              <p className="text-xs text-base-500">Storage used</p>
            </div>
          </div>
          {processingCount > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-accent-400">
              <Database size={13} />
              {processingCount} source{processingCount > 1 ? "s" : ""} still processing.
            </p>
          )}
        </section>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>

        <section className="card mt-10 border-red-500/30 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-red-400">Danger zone</h2>
          <p className="mt-1 text-sm text-base-400">
            Deleting a project permanently removes its sources, conversations, and settings.
          </p>
          <Button variant="danger" className="mt-4" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={16} />
            Delete project
          </Button>
        </section>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this project?"
        description={`This will permanently delete "${project.name}" and everything in it. This can't be undone.`}
        confirmLabel="Delete project"
        danger
        loading={deleting}
      />
    </div>
  );
}
