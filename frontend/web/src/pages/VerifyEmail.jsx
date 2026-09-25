import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Field from "../components/common/Field.jsx";
import Button from "../components/common/Button.jsx";
import Spinner from "../components/common/Spinner.jsx";
import authApi from "../api/authApi";
import useToast from "../hooks/useToast";
import { normalizeError } from "../api/client";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const toast = useToast();

  const [state, setState] = useState(token ? "verifying" : "no-token"); // verifying | success | error | no-token
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    authApi
      .verifyEmail({ token })
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    setResending(true);
    try {
      await authApi.resendVerification({ email: resendEmail.trim() });
      toast.success("Verification email sent. Please check your inbox.");
    } catch (err) {
      toast.error(normalizeError(err).message || "Couldn't resend the verification email.");
    } finally {
      setResending(false);
    }
  };

  if (state === "verifying") {
    return (
      <AuthLayout title="Verifying your email">
        <div className="flex flex-col items-center gap-3 py-4">
          <Spinner size={26} />
          <p className="text-sm text-base-400">One moment while we confirm your account...</p>
        </div>
      </AuthLayout>
    );
  }

  if (state === "success") {
    return (
      <AuthLayout title="Email verified successfully">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle2 size={40} className="text-emerald-400" />
          <p className="text-sm text-base-300">Your account is ready to use.</p>
          <Link to="/login" className="w-full">
            <Button className="w-full">Continue to ChatFiles</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (state === "error") {
    return (
      <AuthLayout title="This link has expired">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <XCircle size={40} className="text-red-400" />
          <p className="text-sm text-base-300">
            This verification link is invalid or has expired. Enter your email to get a new one.
          </p>
          <form onSubmit={handleResend} className="w-full space-y-3 text-left">
            <Field
              label="Email"
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
            />
            <Button type="submit" loading={resending} className="w-full">
              Resend verification email
            </Button>
          </form>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Verify your email" subtitle="We sent a verification link to your inbox.">
      <form onSubmit={handleResend} className="space-y-4">
        <Field
          label="Email"
          type="email"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          required
        />
        <Button type="submit" loading={resending} className="w-full">
          Resend verification email
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-base-400">
        Already verified?{" "}
        <Link to="/login" className="font-medium text-accent-400 hover:text-accent-300">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
