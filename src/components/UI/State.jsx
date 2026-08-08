/**
 * Reusable status pill used inside tables and cards.
 *
 * Props:
 * - children: The status label and optional icon displayed inside the pill.
 * - fontColor: Text and icon color. Defaults to the green "Done" color.
 * - bgColor: Background color. Defaults to the pale-green "Done" background.
 * - className: Adds or overrides Tailwind classes for one status pill.
 * - style: Adds or overrides inline CSS styles.
 * - props: Any other native span props, such as title, role, or aria-label.
 */
function State({
  children,
  fontColor = "#1F9D55",
  bgColor = "#E7F7EE",
  className = "",
  style = {},
  ...props
}) {
  // Use a span so the status stays inline inside a table cell.
  // The shared classes control its size, spacing, pill shape, and typography.
  // Inline colors make fontColor and bgColor work with any valid CSS color.
  return (
    <span
      className={`
        inline-flex min-h-[30px] min-w-[78px] w-fit shrink-0
        items-center justify-center gap-1 whitespace-nowrap
        rounded-full px-4 py-[5px]
        text-sm font-bold leading-5
        ${className}
      `}
      style={{
        color: fontColor,
        backgroundColor: bgColor,
        ...style,
      }}
      {...props}
    >
      {/* Render the status text and any icon passed by the parent. */}
      {children}
    </span>
  );
}

export default State;
