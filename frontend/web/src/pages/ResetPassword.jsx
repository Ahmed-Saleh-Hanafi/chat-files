import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Field from "../components/common/Field.jsx";
import Button from "../components/common/Button.jsx";
import authApi from "../api/authApi";
import { normalizeError } from "../api/client";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, ...form });
      setDone(true);
    } catch (err) {
      setError(normalizeError(err).message || "Couldn't reset your password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Password changed successfully">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle2 size={40} className="text-emerald-400" />
          <Button className="w-full" onClick={() => navigate("/login")}>
            Go to login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        <Field
          label="New password"
          type="password"
          value={form.password}
          onChange={update("password")}
          required
        />
        <Field
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Reset password
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-base-400">
        <Link to="/login" className="font-medium text-accent-400 hover:text-accent-300">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
