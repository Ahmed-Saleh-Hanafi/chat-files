import { useContext } from "react";
import { ProjectListContext } from "../context/ProjectListContext.jsx";

export default function useProjectList() {
  const ctx = useContext(ProjectListContext);
  if (!ctx) throw new Error("useProjectList must be used within a ProjectListProvider");
  return ctx;
}
