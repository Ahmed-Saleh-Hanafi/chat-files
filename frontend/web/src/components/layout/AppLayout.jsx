import { useCallback, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Menu, PanelRight } from "lucide-react";
import LeftSidebar from "./LeftSidebar.jsx";
import RightSidebar from "./RightSidebar.jsx";
import NewProjectModal from "../project/NewProjectModal.jsx";
import UploadModal from "../project/UploadModal.jsx";
import RenameDialog from "../common/RenameDialog.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { ProjectProvider } from "../../context/ProjectContext.jsx";
import useToast from "../../hooks/useToast";
import projectApi from "../../api/projectApi";
import conversationApi from "../../api/conversationApi";
import useProject from "../../hooks/useProject";
import useProjectList from "../../hooks/useProjectList";

// Bridges the outer layout (which needs project actions like "New chat" /
// "Upload") with the ProjectContext created further down the tree.
function LayoutBody({
  leftOpen,
  rightOpen,
  setLeftOpen,
  setRightOpen,
  onNewProject,
  showRightSidebar,
}) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const toast = useToast();
  const { projects } = useProjectList();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const proj = useProject();

  const handleNewChat = useCallback(async () => {
    if (!projectId) return;
    try {
      const conversation = await conversationApi.create(projectId);
      await proj.reloadConversations();
      navigate(`/app/projects/${projectId}/chat/${conversation.id}`);
    } catch {
      toast.error("Couldn't start a new chat. Please try again.");
    }
    setLeftOpen(false);
  }, [projectId, navigate, proj, toast, setLeftOpen]);

  const handleRenameConversation = async (newTitle) => {
    setBusy(true);
    try {
      await conversationApi.rename(projectId, renameTarget.id, { title: newTitle });
      await proj.reloadConversations();
      toast.success("Conversation renamed.");
      setRenameTarget(null);
    } catch {
      toast.error("Couldn't rename the conversation.");
    } finally {
      setBusy(false);
    }
  };

  const handleArchive = async () => {
    setBusy(true);
    try {
      await conversationApi.archive(projectId, archiveTarget.id);
      await proj.reloadConversations();
      toast.success("Conversation archived.");
      setArchiveTarget(null);
    } catch {
      toast.error("Couldn't archive the conversation.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await conversationApi.remove(projectId, deleteTarget.id);
      await proj.reloadConversations();
      toast.success("Conversation deleted.");
      setDeleteTarget(null);
      navigate(`/app/projects/${projectId}`);
    } catch {
      toast.error("Couldn't delete the conversation.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {leftOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setLeftOpen(false)} />
          <div className="absolute inset-y-0 left-0 animate-in">
            <LeftSidebar
              projects={projects}
              onNewProject={() => {
                setLeftOpen(false);
                onNewProject();
              }}
              onClose={() => setLeftOpen(false)}
              isDrawer
            />
          </div>
        </div>
      )}

      <div className="hidden lg:block">
        <LeftSidebar projects={projects} onNewProject={onNewProject} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-base-700 bg-base-900 px-3 py-2.5 lg:hidden">
          <button
            onClick={() => setLeftOpen(true)}
            className="rounded-md p-2 text-base-300 hover:bg-base-800"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-base-100">ChatFiles</span>
          {showRightSidebar ? (
            <button
              onClick={() => setRightOpen(true)}
              className="rounded-md p-2 text-base-300 hover:bg-base-800"
              aria-label="Open project panel"
            >
              <PanelRight size={20} />
            </button>
          ) : (
            <span className="w-9" />
          )}
        </header>

        <main className="flex min-h-0 flex-1">
          <Outlet
            context={{
              onUploadClick: () => setUploadOpen(true),
              onNewChat: handleNewChat,
            }}
          />
        </main>
      </div>

      {showRightSidebar && (
        <>
          {rightOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setRightOpen(false)} />
              <div className="absolute inset-y-0 right-0 animate-in">
                <RightSidebar
                  onUploadClick={() => {
                    setRightOpen(false);
                    setUploadOpen(true);
                  }}
                  onNewChat={handleNewChat}
                  onRenameConversation={(c) => setRenameTarget(c)}
                  onArchiveConversation={(c) => setArchiveTarget(c)}
                  onDeleteConversation={(c) => setDeleteTarget(c)}
                  onClose={() => setRightOpen(false)}
                  isDrawer
                />
              </div>
            </div>
          )}
          <div className="hidden lg:block">
            <RightSidebar
              onUploadClick={() => setUploadOpen(true)}
              onNewChat={handleNewChat}
              onRenameConversation={(c) => setRenameTarget(c)}
              onArchiveConversation={(c) => setArchiveTarget(c)}
              onDeleteConversation={(c) => setDeleteTarget(c)}
            />
          </div>
        </>
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      <RenameDialog
        open={!!renameTarget}
        title="Rename conversation"
        label="Conversation name"
        initialValue={renameTarget?.title || ""}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRenameConversation}
        loading={busy}
      />

      <ConfirmDialog
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        title="Archive this conversation?"
        description="You can find archived conversations from your project's conversation history later."
        confirmLabel="Archive"
        loading={busy}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this conversation?"
        description="This will permanently remove the conversation and its messages."
        confirmLabel="Delete"
        danger
        loading={busy}
      />
    </>
  );
}

export default function AppLayout({ showRightSidebar = true }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { upsertProject } = useProjectList();

  const handleCreateProject = async (payload) => {
    const project = await projectApi.create(payload);
    upsertProject(project);
    toast.success("Project created successfully.");
    setNewProjectOpen(false);
    navigate(`/app/projects/${project.id}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-base-950">
      <ProjectProvider>
        <LayoutBody
          leftOpen={leftOpen}
          rightOpen={rightOpen}
          setLeftOpen={setLeftOpen}
          setRightOpen={setRightOpen}
          onNewProject={() => setNewProjectOpen(true)}
          showRightSidebar={showRightSidebar}
        />
      </ProjectProvider>

      <NewProjectModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
