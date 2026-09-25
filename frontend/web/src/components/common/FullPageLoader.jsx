import Spinner from "./Spinner.jsx";

export default function FullPageLoader({ label = "Loading..." }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-base-950">
      <Spinner size={28} />
      <p className="text-sm text-base-400">{label}</p>
    </div>
  );
}
