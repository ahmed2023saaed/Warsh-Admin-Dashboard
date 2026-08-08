function FilterButton({
  children,
  active = false,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-[9px] border px-[14px] py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40";

  const activeStyles = active
    ? "border-[#1C1712] bg-[#1C1712] text-white shadow-sm hover:bg-[#2A2119] [&_span]:bg-[#514B46] [&_span]:text-white"
    : "border-[#E8E2D8] bg-white text-[#8A8074] hover:border-[#D8C9B7] hover:bg-[#FDFBF8] [&_span]:bg-[#F0EDEA] [&_span]:text-[#8A8074]";

  return (
    <button
      type={type}
      aria-pressed={active}
      className={`${baseStyles} ${activeStyles} [&_span]:inline-flex [&_span]:min-w-6 [&_span]:items-center [&_span]:justify-center [&_span]:rounded-full [&_span]:px-1.5 [&_span]:py-1 [&_span]:text-xs [&_span]:font-bold [&_span]:leading-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default FilterButton;
