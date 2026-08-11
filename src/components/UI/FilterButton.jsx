/**
 * Reusable button for filtering a list by status.
 *
 * Props:
 * - children: The filter label, such as "All" or "Pending".
 * - count: The raw number displayed in the badge beside the label.
 * - active: Controls whether the button uses selected or unselected styling.
 * - className: Adds or overrides Tailwind classes for a specific filter.
 * - type: Native button type. Defaults to "button".
 * - props: Any other native button props, including onClick and aria-label.
 */
function FilterButton({
  children,
  count,
  active = false,
  className = "",
  type = "button",
  ...props
}) {
  // Add thousands separators to counts: 2560 becomes "2,560".
  function formatCount(value) {
    return Number(value).toLocaleString("en-US");
  }

  // Layout, size, typography, and keyboard-focus styles shared by every filter.
  const baseStyles =
    "inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border px-[14px] py-2 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40";

  // Switch colors for the selected and unselected states.
  const activeStyles = active
    ? "border-[#1C1712] bg-[#1C1712] text-white shadow-sm hover:bg-[#2A2119] [&_span]:bg-[#514B46] [&_span]:text-white"
    : "border-[#E8E2D8] bg-white text-[#8A8074] hover:border-[#D8C9B7] hover:bg-[#FDFBF8] [&_span]:bg-[#F0EDEA] [&_span]:text-[#8A8074]";

  // aria-pressed exposes the selected state, while props forwards onClick and other HTML attributes.
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`${baseStyles} ${activeStyles} [&_span]:inline-flex [&_span]:min-w-6 [&_span]:items-center [&_span]:justify-center [&_span]:rounded-full [&_span]:px-1.5 [&_span]:py-1 [&_span]:text-[13px] [&_span]:font-bold [&_span]:leading-none ${className}`}
      {...props}
    >
      {/* Display the filter name. */}
      {children}
      {/* Only render the badge when a count was provided. */}
      {count !== undefined && <span>{formatCount(count)}</span>}
    </button>
  );
}

export default FilterButton;
