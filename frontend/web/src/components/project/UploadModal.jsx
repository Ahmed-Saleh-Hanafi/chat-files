import { useCallback, useRef, useState } from "react";
import { UploadCloud, Link as LinkIcon, X, Check, Loader2, AlertCircle } from "lucide-react";
import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";
import sourceApi from "../../api/sourceApi";
import useProject from "../../hooks/useProject";
import useToast from "../../hooks/useToast";
import { getFileMeta, formatBytes } from "../../utils/fileTypes";
import { normalizeError } from "../../api/client";

const PROCESSING_STEPS = [
  "uploading",
  "validating",
  "extracting",
  "chunking",
  "embedding",
  "indexing",
  "ready",
];

function StatusRow({ job }) {
  const { icon: Icon, className } = getFileMeta(job.name);
  const stepIndex = PROCESSING_STEPS.indexOf(job.status);
  const isFailed = job.status === "failed";
  const isReady = job.status === "ready";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-base-700 bg-base-900 px-3 py-2.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${className}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-base-100">{job.name}</p>
        {job.size != null && <p className="text-xs text-base-500">{formatBytes(job.size)}</p>}
        {!isFailed && !isReady && (
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-base-700">
            <div
              className="h-full bg-accent-500 transition-all duration-300"
              style={{
                width: `${
                  job.status === "uploading"
                    ? job.progress || 0
                    : ((stepIndex + 1) / PROCESSING_STEPS.length) * 100
                }%`,
              }}
            />
          </div>
        )}
        {isFailed && <p className="mt-0.5 text-xs text-red-400">Processing failed</p>}
      </div>
      <div className="shrink-0">
        {isReady && <Check size={17} className="text-emerald-400" />}
        {isFailed && <AlertCircle size={17} className="text-red-400" />}
        {!isReady && !isFailed && <Loader2 size={16} className="animate-spin text-accent-400" />}
      </div>
    </div>
  );
}

export default function UploadModal({ open, onClose }) {
  const { projectId, addOrUpdateSource } = useProject();
  const toast = useToast();
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobs, setJobs] = useState([]); // { id, name, size, status, progress }
  const [urlValue, setUrlValue] = useState("");
  const [addingUrl, setAddingUrl] = useState(false);

  const pollStatus = useCallback(
    async (localId, source) => {
      const poll = async () => {
        try {
          const status = await sourceApi.getStatus(projectId, source.id);
          setJobs((prev) =>
            prev.map((j) => (j.id === localId ? { ...j, status: status.status } : j))
          );
          addOrUpdateSource({ ...source, status: status.status });
          if (!["ready", "failed"].includes(status.status)) {
            setTimeout(poll, 1200);
          }
        } catch {
          setJobs((prev) => prev.map((j) => (j.id === localId ? { ...j, status: "failed" } : j)));
        }
      };
      poll();
    },
    [projectId, addOrUpdateSource]
  );

  const uploadFile = useCallback(
    async (file) => {
      const localId = `${file.name}-${Date.now()}-${Math.random()}`;
      setJobs((prev) => [
        ...prev,
        { id: localId, name: file.name, size: file.size, status: "uploading", progress: 0 },
      ]);
      try {
        const source = await sourceApi.uploadFile(projectId, file, {
          onProgress: (pct) =>
            setJobs((prev) => prev.map((j) => (j.id === localId ? { ...j, progress: pct } : j))),
        });
        setJobs((prev) =>
          prev.map((j) => (j.id === localId ? { ...j, status: "validating" } : j))
        );
        addOrUpdateSource(source);
        pollStatus(localId, source);
      } catch (err) {
        setJobs((prev) => prev.map((j) => (j.id === localId ? { ...j, status: "failed" } : j)));
        toast.error(normalizeError(err).message || `Couldn't upload ${file.name}.`);
      }
    },
    [projectId, addOrUpdateSource, pollStatus, toast]
  );

  const handleFiles = useCallback(
    (fileList) => {
      Array.from(fileList).forEach(uploadFile);
    },
    [uploadFile]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = async () => {
    if (!urlValue.trim()) return;
    setAddingUrl(true);
    const localId = `url-${Date.now()}`;
    setJobs((prev) => [
      ...prev,
      { id: localId, name: urlValue.trim(), status: "validating" },
    ]);
    try {
      const source = await sourceApi.addUrl(projectId, { url: urlValue.trim() });
      addOrUpdateSource(source);
      pollStatus(localId, source);
      setUrlValue("");
    } catch (err) {
      setJobs((prev) => prev.map((j) => (j.id === localId ? { ...j, status: "failed" } : j)));
      toast.error(normalizeError(err).message || "Couldn't add that URL.");
    } finally {
      setAddingUrl(false);
    }
  };

  const handleClose = () => {
    setJobs([]);
    setUrlValue("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Upload knowledge" size="lg">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragActive ? "border-accent-500 bg-accent-500/5" : "border-base-600 hover:border-base-500"
        }`}
      >
        <UploadCloud size={28} className="text-accent-400" />
        <p className="text-sm font-medium text-base-100">
          Drag and drop files, or click to browse
        </p>
        <p className="text-xs text-base-500">
          PDF, DOCX, TXT, XLSX, CSV, images, audio, and video
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-500" />
          <input
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
            placeholder="Add a URL (https://...)"
            className="field-input pl-9"
          />
        </div>
        <Button variant="secondary" onClick={handleAddUrl} loading={addingUrl}>
          Add URL
        </Button>
      </div>

      {jobs.length > 0 && (
        <div className="mt-5 max-h-64 space-y-2 overflow-y-auto">
          {jobs.map((job) => (
            <StatusRow key={job.id} job={job} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={handleClose}>
          <X size={16} />
          Done
        </Button>
      </div>
    </Modal>
  );
}
