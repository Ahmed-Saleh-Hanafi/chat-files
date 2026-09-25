import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import GoogleButton from "../components/auth/GoogleButton.jsx";
import Field from "../components/common/Field.jsx";
import Button from "../components/common/Button.jsx";
import useAuth from "../hooks/useAuth";
import { normalizeError } from "../api/client";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/app/dashboard";

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      const normalized = normalizeError(err);
      if (normalized.status === 403) {
        setError("Please verify your email before signing in.");
      } else {
        setError("Email or password is incorrect.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // In production this opens Google's OAuth consent screen and resolves
    // with a credential/id_token that is exchanged with the backend here.
    setError("");
    try {
      await loginWithGoogle({ credential: "GOOGLE_ID_TOKEN" });
      navigate(from, { replace: true });
    } catch {
      setError("We couldn't sign you in with Google. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your projects."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-accent-400 hover:text-accent-300">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          required
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={update("password")}
          required
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-base-300">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={update("rememberMe")}
              className="h-4 w-4 rounded border-base-600 bg-base-900 text-accent-500 focus:ring-accent-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-accent-400 hover:text-accent-300">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-base-700" />
        <span className="text-xs text-base-500">or</span>
        <div className="h-px flex-1 bg-base-700" />
      </div>

      <GoogleButton onClick={handleGoogle} />
    </AuthLayout>
  );
}
