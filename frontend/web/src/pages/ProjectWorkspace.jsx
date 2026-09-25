import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import Spinner from "../components/common/Spinner.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import useProject from "../hooks/useProject";
import { AlertTriangle } from "lucide-react";

export default function ProjectWorkspace() {
  const { conversationId } = useParams();
  const { project, status, reload } = useProject();
  const { onUploadClick } = useOutletContext() || {};

  useEffect(() => {
    document.title = project ? `${project.name} — ChatFiles` : "ChatFiles";
  }, [project]);

  if (status === "loading" && !project) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  if (status === "error" && !project) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load this project"
          description="It may have been deleted, or you may not have access to it."
          action={
            <button onClick={reload} className="btn-secondary mt-2">
              Try again
            </button>
          }
        />
      </div>
    );
  }

  return <ChatWindow conversationId={conversationId} onUploadClick={onUploadClick} />;
}
