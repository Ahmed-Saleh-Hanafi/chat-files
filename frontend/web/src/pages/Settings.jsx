import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { User, ShieldCheck, SlidersHorizontal, Database, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import Field from "../components/common/Field.jsx";
import Button from "../components/common/Button.jsx";
import Avatar from "../components/common/Avatar.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import userApi from "../api/userApi";
import { normalizeError } from "../api/client";
import { formatFullDate } from "../utils/formatDate";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "data", label: "Data", icon: Database },
];

function ProfileTab({ user, setUser }) {
  const toast = useToast();
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userApi.updateProfile(form);
      setUser((u) => ({ ...u, ...updated }));
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await userApi.uploadAvatar(file);
      setUser((u) => ({ ...u, avatarUrl: updated.avatarUrl }));
      toast.success("Profile photo updated.");
    } catch {
      toast.error("Couldn't upload that image.");
    }
  };

  return (
    <form onSubmit={handleSave} className="card space-y-5 p-6">
      <div className="flex items-center gap-4">
        <Avatar name={user?.username} src={user?.avatarUrl} size={56} />
        <label className="btn-secondary cursor-pointer text-sm">
          Change photo
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </label>
      </div>
      <Field
        label="Username"
        value={form.username}
        onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
      />
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function SecurityTab() {
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    userApi.listSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      await userApi.changePassword(form);
      toast.success("Password changed.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't change your password.");
    } finally {
      setSaving(false);
    }
  };

  const revoke = async (sessionId) => {
    try {
      await userApi.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Session revoked.");
    } catch {
      toast.error("Couldn't revoke that session.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleChangePassword} className="card space-y-4 p-6">
        <h3 className="text-sm font-semibold text-base-100">Change password</h3>
        <Field
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
        />
        <Field
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
        />
        <Field
          label="Confirm new password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
        />
        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            Update password
          </Button>
        </div>
      </form>

      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-base-100">Active sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-base-500">No other active sessions.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-base-700 bg-base-900 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm text-base-200">{s.device || "Unknown device"}</p>
                  <p className="text-xs text-base-500">
                    {s.location || "Unknown location"} · Last active {formatFullDate(s.lastActiveAt)}
                  </p>
                </div>
                <button
                  onClick={() => revoke(s.id)}
                  className="text-xs font-medium text-red-400 hover:text-red-300"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PreferencesTab() {
  const toast = useToast();
  const [prefs, setPrefs] = useState({ theme: "dark", language: "en", notifications: true });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.updatePreferences(prefs);
      toast.success("Preferences saved.");
    } catch {
      toast.error("Couldn't save your preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card space-y-5 p-6">
      <div>
        <label className="field-label">Theme</label>
        <select
          className="field-input"
          value={prefs.theme}
          onChange={(e) => setPrefs((p) => ({ ...p, theme: e.target.value }))}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="system">Match system</option>
        </select>
      </div>
      <div>
        <label className="field-label">Language</label>
        <select
          className="field-input"
          value={prefs.language}
          onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}
        >
          <option value="en">English</option>
          <option value="ar">Arabic</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      <label className="flex items-center justify-between rounded-lg border border-base-700 bg-base-900 px-3 py-2.5">
        <span className="text-sm text-base-200">Email notifications</span>
        <input
          type="checkbox"
          checked={prefs.notifications}
          onChange={(e) => setPrefs((p) => ({ ...p, notifications: e.target.checked }))}
          className="h-4 w-4 rounded border-base-600 bg-base-900 text-accent-500 focus:ring-accent-500"
        />
      </label>
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}

function DataTab() {
  const { logout } = useAuth();
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await userApi.exportData();
      toast.success("We're preparing your export — you'll get an email when it's ready.");
    } catch {
      toast.error("Couldn't start the export. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userApi.deleteAccount({ password });
      toast.success("Your account has been deleted.");
      await logout();
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't delete your account.");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-base-100">Export account data</h3>
        <p className="mt-1 text-sm text-base-400">
          Download a copy of your projects, sources, and conversations.
        </p>
        <Button variant="secondary" className="mt-4" onClick={handleExport} loading={exporting}>
          Export data
        </Button>
      </div>

      <div className="card border-red-500/30 p-6">
        <h3 className="text-sm font-semibold text-red-400">Delete account</h3>
        <p className="mt-1 text-sm text-base-400">
          This permanently deletes your account and everything in it. This can’t be undone.
        </p>
        <div className="mt-4 max-w-xs">
          <Field
            label="Confirm your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button variant="danger" className="mt-3" onClick={() => setDeleteOpen(true)} disabled={!password}>
          Delete account
        </Button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete your account?"
        description="This action is permanent and cannot be undone. Confirm your password below to continue."
        confirmLabel="Delete account"
        danger
        loading={deleting}
      />
    </div>
  );
}

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [tab, setTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : "profile");

  const selectTab = (id) => {
    setTab(id);
    setSearchParams({ tab: id });
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-bold text-base-100">Settings</h1>

        <div className="mt-6 flex gap-6">
          <nav className="flex w-44 shrink-0 flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-accent-600/15 text-accent-400"
                    : "text-base-300 hover:bg-base-800 hover:text-base-100"
                }`}
              >
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Log out
            </button>
          </nav>

          <div className="min-w-0 flex-1">
            {tab === "profile" && <ProfileTab user={user} setUser={setUser} />}
            {tab === "security" && <SecurityTab />}
            {tab === "preferences" && <PreferencesTab />}
            {tab === "data" && <DataTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
