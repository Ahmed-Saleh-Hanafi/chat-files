import { Link } from "react-router-dom";
import { FilesIcon } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-base-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 text-white">
            <FilesIcon size={19} />
          </div>
          <span className="text-lg font-bold tracking-tight text-base-100">ChatFiles</span>
        </Link>

        <div className="card p-7 shadow-xl">
          <h1 className="text-xl font-semibold text-base-100">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-base-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-base-400">{footer}</div>}
      </div>
    </div>
  );
}
