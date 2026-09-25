import { useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";
import useClickOutside from "../../hooks/useClickOutside";

export default function DropdownMenu({ items, trigger, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="rounded-md p-1.5 text-base-400 hover:bg-base-700 hover:text-base-100"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger || <MoreVertical size={16} />}
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            "animate-in absolute z-30 mt-1 w-44 overflow-hidden rounded-lg border border-base-600 bg-base-850 py-1 shadow-xl",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 border-t border-base-700" />
            ) : (
              <button
                key={item.label}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onClick?.();
                }}
                className={clsx(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-base-200 hover:bg-base-700"
                )}
              >
                {item.icon && <item.icon size={15} />}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
