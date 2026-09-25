import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext.jsx";

export default function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within a ProjectProvider");
  return ctx;
}
