import { useEffect } from "react";

export default function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handler(e);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, handler, active]);
}
