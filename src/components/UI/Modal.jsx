import { useEffect, useId } from "react";
import { X } from "lucide-react";

// The available modal sizes.
const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/**
 * A reusable popup window.
 *
 * Main props:
 * - open: Use true to show the modal and false to hide it.
 * - onClose: The function used to close the modal.
 * - title: The text shown at the top.
 * - children: The content shown in the middle.
 * - footer: Optional buttons shown at the bottom.
 * - size: Use "sm", "md", or "lg". The default is "md".
 *
 * Extra props:
 * - showCloseButton: Show or hide the X button.
 * - dismissOnBackdrop: Close when the dark background is clicked.
 * - className: Custom styles for the modal box.
 * - contentClassName: Custom styles for the middle content.
 * - footerClassName: Custom styles for the footer.
 *
 * Example:
 * const [isModalOpen, setIsModalOpen] = useState(false);
 *
 * <Button onClick={() => setIsModalOpen(true)}>Open modal</Button>
 *
 * <Modal
 *   open={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Create booking"
 *   footer={<Button onClick={() => setIsModalOpen(false)}>Close</Button>}
 * >
 *   Put your form or content here.
 * </Modal>
 */
function Modal({
  open,
  onClose,
  title = "Dialog",
  children,
  size = "md",
  footer,
  className = "",
  contentClassName = "",
  footerClassName = "",
  closeLabel = "Close",
  dismissOnBackdrop = true,
  showCloseButton = true,
}) {
  const titleId = useId();

  // Close with the Escape key and stop the page behind the modal from scrolling.
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
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

  // Show nothing when open is false.
  if (!open) return null;

  function handleBackdropClick() {
    if (dismissOnBackdrop) {
      onClose?.();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full rounded-2xl bg-white shadow-xl ${modalSizes[size] ?? modalSizes.md} ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top section: title and X button. */}
        <div className="flex items-center justify-between border-b border-[#E8E2D8] px-6 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-[#1C1712]">
            {title}
          </h2>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="flex cursor-pointer items-center justify-center rounded-lg p-1 text-[#8A8074] transition-colors hover:bg-[#F6F3EE] hover:text-[#1C1712] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40"
            >
              <X aria-hidden="true" size={20} />
            </button>
          )}
        </div>

        {/* Middle section: put your form or other content here. */}
        <div
          className={`max-h-[70vh] overflow-y-auto px-6 py-4 ${contentClassName}`}
        >
          {children}
        </div>

        {/* Bottom section: usually contains Cancel and Save buttons. */}
        {footer && (
          <div
            className={`flex justify-end gap-3 border-t border-[#E8E2D8] px-6 py-4 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
