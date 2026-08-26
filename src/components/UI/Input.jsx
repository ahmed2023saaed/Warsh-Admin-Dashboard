function Input({
  type = "text",
  placeholder = "",
  dimensions = { width: "240px", height: "36px" },
  ID = "",
  icon: Icon = null,
  value,
  onChange,
  className = "",
}) {
  return (
    <div
      style={{
        "--search-width": dimensions.width,
        "--search-height": dimensions.height,
      }}
      className={`
        flex items-center gap-2
        h-[var(--search-height)]
        w-[var(--search-width)]
        max-w-full
        rounded-[10px]
        border border-[#E8E2D8]
        bg-white
        px-[14px]
        focus-within:border-[#E08B2F]
        focus-within:ring-[3px] focus-within:ring-[#E08B2F]/15
        ${className}
      `}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          size={16}
          strokeWidth={2}
          className="shrink-0 text-[#8A8074]"
        />
      )}

      <input
        id={ID}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          min-w-0 flex-1 border-0 bg-transparent
          text-[15.5px] text-[#1C1712]
          outline-none placeholder:text-[#8A8074]
        "
      />
    </div>
  );
}

export default Input;
