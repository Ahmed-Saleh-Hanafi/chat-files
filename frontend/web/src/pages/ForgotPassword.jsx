import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MailCheck } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Field from "../components/common/Field.jsx";
import Button from "../components/common/Button.jsx";
import authApi from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
    } finally {
      // Always show the same confirmation, whether or not the email exists,
      // to avoid account-enumeration risks.
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <MailCheck size={36} className="text-accent-400" />
          <p className="text-sm text-base-300">
            If an account exists for <span className="text-base-100">{email}</span>, we’ve sent a
            password reset link.
          </p>
          <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-accent-400 hover:text-accent-300">
            <ArrowLeft size={15} /> Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="We'll email you a link to reset it.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full">
          Send reset link
        </Button>
      </form>
      <Link
        to="/login"
        className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-accent-400 hover:text-accent-300"
      >
        <ArrowLeft size={15} /> Back to login
      </Link>
    </AuthLayout>
  );
}
