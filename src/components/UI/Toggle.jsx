/**
 * Reusable accessible on/off switch.
 *
 * Props:
 * - checked: Current boolean value.
 * - onChange: Receives the new boolean value.
 * - label: Optional title shown beside the switch.
 * - description: Optional supporting text.
 * - id: Connects the label to the checkbox.
 * - disabled: Prevents interaction when true.
 * - className: Adds custom classes to the outer wrapper.
 *
 * Example:
 * const [featured, setFeatured] = useState(false);
 *
 * <Toggle
 *   id="featured-center"
 *   checked={featured}
 *   onChange={setFeatured}
 *   label="Featured center"
 *   description="Show this service center in featured results."
 * />
 */
function Toggle({
  checked = false,
  onChange,
  label,
  description,
  id,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && (
            <label
              htmlFor={id}
              className="block cursor-pointer text-sm font-bold text-[#1C1712]"
            >
              {label}
            </label>
          )}

          {description && (
            <p className="mt-1 text-xs leading-5 text-[#8A8074]">
              {description}
            </p>
          )}
        </div>
      )}

      <label
        className={`relative inline-flex shrink-0 items-center ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
          className="peer sr-only"
        />

        <span className="block h-[22px] w-[38px] rounded-full bg-[#E3DDD2] transition-colors duration-200 peer-checked:bg-[#1C1712] peer-focus-visible:ring-2 peer-focus-visible:ring-[#E08B2F]/40 peer-focus-visible:ring-offset-2" />

        <span className="pointer-events-none absolute top-0.5 block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ltr:left-0.5 ltr:peer-checked:translate-x-4 rtl:right-0.5 rtl:peer-checked:-translate-x-4" />
      </label>
    </div>
  );
}

export { Toggle };
export default Toggle;
