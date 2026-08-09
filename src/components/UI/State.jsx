/**
 * Reusable status badge.
 *
 * Presets:
 * <State good>✓ Done</State>
 * <State bad>✕ Cancelled</State>
 * <State between>Upcoming</State>
 *
 * Custom colors:
 * <State fontColor="#2F6FED" bgColor="#EAF1FE">Working</State>
 */
const stateStyles = {
  good: { color: "#1F9D55", backgroundColor: "#E7F7EE" },
  bad: { color: "#D64545", backgroundColor: "#FBE9E9" },
  between: { color: "#C8790A", backgroundColor: "#FDF1DE" },
};

function State({
  children,
  good = false,
  bad = false,
  between = false,
  fontColor = "#1C1712",
  bgColor = "#F6F3EE",
  className = "",
  style = {},
  ...props
}) {
  let selectedStyle = {
    color: fontColor,
    backgroundColor: bgColor,
  };

  // Presets take priority; custom colors are used when all presets are false.
  if (good) {
    selectedStyle = stateStyles.good;
  } else if (bad) {
    selectedStyle = stateStyles.bad;
  } else if (between) {
    selectedStyle = stateStyles.between;
  }

  // Use a span so the status stays inline inside a table cell.
  // The shared classes control its size, spacing, pill shape, and typography.
  // Inline styles allow preset and custom CSS colors.
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
        ...selectedStyle,
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
