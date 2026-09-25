import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-base-950 px-6 text-center">
      <FileQuestion size={40} className="text-base-500" />
      <div>
        <h1 className="text-xl font-semibold text-base-100">Page not found</h1>
        <p className="mt-1.5 text-sm text-base-400">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
      </div>
      <Link to="/" className="btn-primary">
        Back to ChatFiles
      </Link>
    </div>
  );
}
