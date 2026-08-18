// components/settings/SettingsSection.jsx

export default function SettingsSection({
  title,
  children,
  className = '',
}) {
  return (
    <section
      className={`rounded-2xl border border-[#E4DCD2] bg-white p-4 shadow-sm ${className}`}
    >
      <h2 className="border-b border-[#E7DED4] pb-2 text-base font-bold text-[#17120E]">
        {title}
      </h2>

      <div>{children}</div>
    </section>
  );
}