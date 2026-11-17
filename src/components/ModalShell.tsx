import { useEffect, type ReactNode } from "react";

interface ModalShellProps {
  onClose: () => void;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

export default function ModalShell({
  onClose,
  labelledBy,
  className = "p-6 pr-14",
  children,
}: ModalShellProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : "Рецепт"}
        onClick={(e) => e.stopPropagation()}
        className={`relative rounded-xl bg-white shadow-xl ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 cursor-pointer font-bold text-gray-500 transition-colors hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
