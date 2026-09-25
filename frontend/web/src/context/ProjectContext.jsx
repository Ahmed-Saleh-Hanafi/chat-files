import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import projectApi from "../api/projectApi";
import sourceApi from "../api/sourceApi";
import conversationApi from "../api/conversationApi";

export const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [sources, setSources] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const loadSources = useCallback(async () => {
    if (!projectId) return;
    const data = await sourceApi.list(projectId);
    setSources(data.items || data || []);
  }, [projectId]);

  const loadConversations = useCallback(async () => {
    if (!projectId) return;
    const data = await conversationApi.list(projectId);
    setConversations(data.items || data || []);
  }, [projectId]);

  const loadAll = useCallback(async () => {
    if (!projectId) return;
    setStatus("loading");
    try {
      const proj = await projectApi.get(projectId);
      setProject(proj);
      await Promise.all([loadSources(), loadConversations()]);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      throw err;
    }
  }, [projectId, loadSources, loadConversations]);

  useEffect(() => {
    // Never mix information between projects: reset state on project switch.
    setProject(null);
    setSources([]);
    setConversations([]);
    if (projectId) loadAll().catch(() => {});
  }, [projectId, loadAll]);

  const addOrUpdateSource = useCallback((source) => {
    setSources((prev) => {
      const idx = prev.findIndex((s) => s.id === source.id);
      if (idx === -1) return [source, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...source };
      return next;
    });
  }, []);

  const removeSourceLocal = useCallback((sourceId) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
  }, []);

  const value = useMemo(
    () => ({
      projectId,
      project,
      setProject,
      sources,
      conversations,
      status,
      reload: loadAll,
      reloadSources: loadSources,
      reloadConversations: loadConversations,
      addOrUpdateSource,
      removeSourceLocal,
    }),
    [
      projectId,
      project,
      sources,
      conversations,
      status,
      loadAll,
      loadSources,
      loadConversations,
      addOrUpdateSource,
      removeSourceLocal,
    ]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
