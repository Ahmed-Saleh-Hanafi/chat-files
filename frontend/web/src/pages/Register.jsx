import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import GoogleButton from "../components/auth/GoogleButton.jsx";
import Field from "../components/common/Field.jsx";
import Button from "../components/common/Button.jsx";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { normalizeError } from "../api/client";

const EMPTY = { username: "", email: "", password: "", confirmPassword: "", acceptTerms: false };

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required.";
    else if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(form.username))
      next.username = "Use 3–24 letters, numbers, dots, dashes or underscores.";

    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";

    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8) next.password = "Use at least 8 characters.";

    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match.";

    if (!form.acceptTerms) next.acceptTerms = "You must accept the terms to continue.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      setSubmitted(true);
    } catch (err) {
      const normalized = normalizeError(err);
      setErrors(normalized.fieldErrors || {});
      toast.error(normalized.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle({ credential: "GOOGLE_ID_TOKEN" });
      navigate("/app/dashboard", { replace: true });
    } catch {
      toast.error("We couldn't sign you up with Google. Please try again.");
    }
  };

  if (submitted) {
    return (
      <AuthLayout title="Check your email">
        <p className="text-sm text-base-300">
          Account created successfully. Please check your email to verify your account.
        </p>
        <Link to="/login" className="mt-5 inline-block">
          <Button className="w-full">Continue to ChatFiles</Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start turning your files into answers."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent-400 hover:text-accent-300">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Username" value={form.username} onChange={update("username")} error={errors.username} />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint="At least 8 characters."
        />
        <Field
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          error={errors.confirmPassword}
        />
        <div>
          <label className="flex items-start gap-2 text-sm text-base-300">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={update("acceptTerms")}
              className="mt-0.5 h-4 w-4 rounded border-base-600 bg-base-900 text-accent-500 focus:ring-accent-500"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="font-medium text-accent-400 hover:text-accent-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-accent-400 hover:text-accent-300">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.acceptTerms && <p className="mt-1.5 text-xs text-red-400">{errors.acceptTerms}</p>}
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-base-700" />
        <span className="text-xs text-base-500">or</span>
        <div className="h-px flex-1 bg-base-700" />
      </div>

      <GoogleButton onClick={handleGoogle} label="Continue with Google" />
    </AuthLayout>
  );
}
