export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-800 text-base-400">
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-base-100">{title}</p>
        {description && <p className="mt-1 max-w-xs text-sm text-base-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
