import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Pencil,
  RefreshCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import useProject from "../hooks/useProject";
import useToast from "../hooks/useToast";
import Spinner from "../components/common/Spinner.jsx";
import RenameDialog from "../components/common/RenameDialog.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import sourceApi from "../api/sourceApi";
import { getFileMeta, formatBytes } from "../utils/fileTypes";
import { formatFullDate } from "../utils/formatDate";
import { normalizeError } from "../api/client";

export default function SourcePreviewPage() {
  const { projectId, sourceId } = useParams();
  const { removeSourceLocal, addOrUpdateSource } = useProject();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(location.state?.page || 1);
  const [zoom, setZoom] = useState(100);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    sourceApi
      .get(projectId, sourceId)
      .then((data) => !cancelled && setSource(data))
      .catch(() => !cancelled && toast.error("Couldn't load this source."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [projectId, sourceId, toast]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  if (!source) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-base-400">This source couldn’t be found.</p>
        <button onClick={() => navigate(`/app/projects/${projectId}`)} className="btn-secondary">
          Back to project
        </button>
      </div>
    );
  }

  const { icon: Icon, className } = getFileMeta(source.name, source.sourceType);
  const isPdf = source.name?.toLowerCase().endsWith(".pdf");
  const totalPages = source.pageCount || 1;

  const handleRename = async (name) => {
    setBusy(true);
    try {
      const updated = await sourceApi.rename(projectId, sourceId, { name });
      setSource((s) => ({ ...s, ...updated }));
      addOrUpdateSource({ ...source, ...updated });
      toast.success("Renamed.");
      setRenameOpen(false);
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't rename this source.");
    } finally {
      setBusy(false);
    }
  };

  const handleReprocess = async () => {
    setBusy(true);
    try {
      await sourceApi.reprocess(projectId, sourceId);
      toast.success("Reprocessing started.");
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't reprocess this source.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await sourceApi.remove(projectId, sourceId);
      removeSourceLocal(sourceId);
      toast.success("Source deleted.");
      navigate(`/app/projects/${projectId}`);
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't delete this source.");
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-base-700 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate(`/app/projects/${projectId}`)}
            className="rounded-md p-1.5 text-base-400 hover:bg-base-800 hover:text-base-100"
          >
            <ArrowLeft size={18} />
          </button>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${className}`}>
            <Icon size={15} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-base-100">{source.name}</p>
            <p className="text-xs text-base-500">
              {formatBytes(source.size)} · Uploaded {formatFullDate(source.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isPdf && (
            <>
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="rounded-md p-2 text-base-400 hover:bg-base-800 hover:text-base-100"
              >
                <ZoomOut size={16} />
              </button>
              <span className="w-10 text-center text-xs text-base-400">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                className="rounded-md p-2 text-base-400 hover:bg-base-800 hover:text-base-100"
              >
                <ZoomIn size={16} />
              </button>
              <div className="mx-1 h-5 w-px bg-base-700" />
            </>
          )}
          <button
            onClick={() => setRenameOpen(true)}
            className="rounded-md p-2 text-base-400 hover:bg-base-800 hover:text-base-100"
            aria-label="Rename"
          >
            <Pencil size={16} />
          </button>
          <a
            href={sourceApi.getDownloadUrl(projectId, sourceId)}
            className="rounded-md p-2 text-base-400 hover:bg-base-800 hover:text-base-100"
            aria-label="Download"
          >
            <Download size={16} />
          </a>
          <button
            onClick={handleReprocess}
            className="rounded-md p-2 text-base-400 hover:bg-base-800 hover:text-base-100"
            aria-label="Reprocess"
          >
            <RefreshCcw size={16} />
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="rounded-md p-2 text-base-400 hover:bg-red-500/10 hover:text-red-400"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden bg-base-900">
          {isPdf ? (
            <>
              <div className="flex items-center justify-center gap-3 border-b border-base-700 py-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md p-1.5 text-base-400 hover:bg-base-800"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-base-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-md p-1.5 text-base-400 hover:bg-base-800"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex flex-1 items-center justify-center overflow-auto p-6">
                <div
                  style={{ width: `${zoom * 4}px`, aspectRatio: "8.5 / 11" }}
                  className="flex shrink-0 items-center justify-center rounded-md border border-base-700 bg-white text-sm text-base-950/60"
                >
                  Page {page} preview
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="mx-auto max-w-2xl space-y-4 text-sm leading-relaxed text-base-300">
                {location.state?.highlightPassage ? (
                  <p className="rounded-lg border border-accent-500/40 bg-accent-500/10 p-4 text-base-100">
                    {location.state.highlightPassage}
                  </p>
                ) : (
                  <p className="text-base-500">
                    Extracted content will appear here once this source has finished processing.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden w-72 shrink-0 flex-col border-l border-base-700 bg-base-900 p-4 lg:flex">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-base-400">
            <Search size={12} /> Relevant passages
          </p>
          <p className="text-xs text-base-500">
            Passages cited in chat answers will be highlighted here for verification.
          </p>

          <div className="mt-6 border-t border-base-700 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-400">
              Metadata
            </p>
            <dl className="space-y-2 text-xs text-base-400">
              <div className="flex justify-between">
                <dt>Type</dt>
                <dd className="text-base-300">{source.sourceType || "File"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Status</dt>
                <dd className="text-base-300">{source.status || "ready"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Chunks</dt>
                <dd className="text-base-300">{source.chunkCount ?? "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <RenameDialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        onSubmit={handleRename}
        title="Rename source"
        label="File name"
        initialValue={source.name}
        loading={busy}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this source?"
        description="This will remove it from the project knowledge."
        confirmLabel="Delete"
        danger
        loading={busy}
      />
    </div>
  );
}
