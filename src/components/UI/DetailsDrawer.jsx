import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function DetailsDrawer({
  open,
  onClose,
  title,
  subtitle,
  header,
  stats,
  tabs,
  children,
  footer,
  className = "",
}) {
  const titleId = useId();

  // Close with Escape and stop the page behind the drawer from scrolling.
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[1px]"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 flex h-dvh w-full flex-col bg-white shadow-[-12px_0_35px_rgba(28,23,18,0.16)] sm:max-w-[720px] ${className}`}
      >
        {/* Sticky header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#E8E2D8] bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            {header || (
              <>
                <h2
                  id={titleId}
                  className="truncate text-xl font-extrabold text-[#1C1712] sm:text-[22px]"
                >
                  {title}
                </h2>

                {subtitle && (
                  <p className="mt-1 text-sm leading-5 text-[#8A8074]">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[#8A8074] transition-colors hover:bg-[#F6F3EE] hover:text-[#1C1712] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40"
          >
            <X aria-hidden="true" size={21} />
          </button>
        </header>

        {/* Optional statistics */}
        {stats && (
          <section className="shrink-0 border-b border-[#E8E2D8] bg-white px-4 py-4 sm:px-6">
            {stats}
          </section>
        )}

        {/* Optional tabs */}
        {tabs && (
          <nav
            aria-label="Details sections"
            className="shrink-0 overflow-x-auto border-b border-[#E8E2D8] bg-white px-4 sm:px-6"
          >
            {tabs}
          </nav>
        )}

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </div>

        {/* Optional sticky footer */}
        {footer && (
          <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[#E8E2D8] bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(28,23,18,0.04)] sm:gap-3 sm:px-6">
            {footer}
          </footer>
        )}
      </aside>
    </div>,
    document.body,
  );
}

export default DetailsDrawer;
