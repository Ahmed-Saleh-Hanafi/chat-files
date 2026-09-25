import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import projectApi from "../api/projectApi";

export const ProjectListContext = createContext(null);

export function ProjectListProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const reload = useCallback(async (search = "") => {
    setStatus("loading");
    try {
      const data = await projectApi.list({ search });
      setProjects(data.items || data || []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const upsertProject = useCallback((project) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx === -1) return [project, ...prev];
      const next = [...prev];
      next[idx] = { ...next[idx], ...project };
      return next;
    });
  }, []);

  const removeProject = useCallback((projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const value = useMemo(
    () => ({ projects, status, reload, upsertProject, removeProject }),
    [projects, status, reload, upsertProject, removeProject]
  );

  return <ProjectListContext.Provider value={value}>{children}</ProjectListContext.Provider>;
}
