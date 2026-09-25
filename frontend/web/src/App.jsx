import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ProjectListProvider } from "./context/ProjectListContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectWorkspace from "./pages/ProjectWorkspace.jsx";
import ProjectSettings from "./pages/ProjectSettings.jsx";
import SourcePreviewPage from "./pages/SourcePreviewPage.jsx";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";
import NotFound from "./pages/NotFound.jsx";

// Wraps every authenticated /app/* route in the shared project-list context,
// so the left sidebar's project list stays in sync across pages without each
// nested layout needing to know about it.
function AppShell() {
  return (
    <ProjectListProvider>
      <Outlet />
    </ProjectListProvider>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Accessible whether logged in or not */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

          <Route element={<AppLayout showRightSidebar={false} />}>
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/help" element={<Help />} />
          </Route>

          <Route element={<AppLayout showRightSidebar />}>
            <Route path="/app/projects/:projectId" element={<ProjectWorkspace />} />
            <Route
              path="/app/projects/:projectId/chat/:conversationId"
              element={<ProjectWorkspace />}
            />
            <Route path="/app/projects/:projectId/settings" element={<ProjectSettings />} />
            <Route
              path="/app/projects/:projectId/sources/:sourceId"
              element={<SourcePreviewPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
