// components/settings/SettingsRow.jsx

export default function SettingsRow({
  title,
  description,
  value,
  action,
  onAction,
  children,
}) {
  return (
    <div className="flex min-h-[49px] items-center justify-between gap-4 border-b border-[#E7DED4] py-3 last:border-b-0">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#17120E]">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-xs text-[#94877E]">
            {description}
          </p>
        )}
      </div>

      <div className="shrink-0">
        {children}

        {!children && action && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-[#E4790B] transition-colors hover:text-[#BD5E00]"
          >
            {action} →
          </button>
        )}

        {!children && !action && value && (
          <span className="text-sm font-bold whitespace-nowrap text-[#17120E]">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}