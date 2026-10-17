// components/settings/SettingsSection.jsx

export default function SettingsSection({
  title,
  children,
  className = '',
  headerAction,
}) {
  return (
    <section
      className={`rounded-2xl border border-[#E4DCD2] bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#E7DED4] pb-2">
        <h2 className="text-base font-bold text-[#17120E]">{title}</h2>
        {headerAction}
      </div>

      <div>{children}</div>
    </section>
  );
}
