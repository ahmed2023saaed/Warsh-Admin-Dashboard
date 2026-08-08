function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#E8E2D8] bg-white px-4 py-2 text-[13px] font-bold text-[#1C1712] transition-colors hover:border-[#D8C9B7] hover:bg-[#FDFBF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
