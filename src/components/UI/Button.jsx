/**
 * Reusable button used for common actions such as Export and Invoice.
 *
 * Props:
 * - children: The text, icon, or elements displayed inside the button.
 * - onClick: Function called when the user clicks the button.
 * - type: Native button type. Defaults to "button" to prevent accidental form submission.
 * - disabled: Disables interaction and applies the disabled styling when true.
 * - className: Adds or overrides Tailwind classes for a specific button.
 * - props: Any other native button props, such as aria-label or title.
 */
function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  // Render a native button with shared styles, then forward any extra HTML props.
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#E8E2D8] bg-white px-4 py-2 text-[13px] font-bold text-[#1C1712] transition-colors hover:border-[#D8C9B7] hover:bg-[#FDFBF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {/* Render everything placed between <Button> and </Button>. */}
      {children}
    </button>
  );
}

export default Button;
