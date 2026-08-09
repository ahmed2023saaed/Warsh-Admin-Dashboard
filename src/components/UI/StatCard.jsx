import { CreditCard } from "lucide-react";

/**
 * Reusable statistics box used for dashboard totals and summaries.
 *
 * Props:
 * - icon: Lucide icon component displayed at the top of the box.
 * - iconColor: Color of the icon.
 * - iconBg: Background color behind the icon.
 * - title: Uppercase label describing the statistic.
 * - value: Main statistic displayed in large text.
 * - unit: Smaller text displayed beside the main value.
 * - footer: Supporting text displayed below the value.
 * - footerColor: Color of the supporting footer text.
 * - className: Adds or overrides Tailwind classes for a specific box.
 * - style: Adds or overrides inline styles on the box.
 * - props: Any other native article props, such as aria-label or title.
 */
function StatCard({
  icon: Icon = CreditCard,
  iconColor = "#C8790A",
  iconBg = "#FDF1DE",
  title = "Monthly Revenue",
  value = "186,400",
  unit = "EGP",
  footer = "▲ +18% vs April",
  footerColor = "#1F9D55",
  className = "",
  style = {},
  ...props
}) {
  return (
    <article
      className={`w-full min-w-[214px] max-w-[280px] rounded-[14px] border border-[#E8E2D8] bg-white p-[18px] ${className}`}
      style={style}
      {...props}
    >
      {/* Icon colors are props so every statistic can use its own theme. */}
      <div
        className="mb-[14px] flex h-8 w-8 items-center justify-center rounded-[9px]"
        style={{ color: iconColor, backgroundColor: iconBg }}
      >
        <Icon aria-hidden="true" size={16} strokeWidth={2} />
      </div>

      {/* Small uppercase label that explains the statistic. */}
      <h3 className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#8A8074]">
        {title}
      </h3>

      {/* Main value and its optional unit share the same baseline. */}
      <div className="flex items-baseline">
        <span className="text-[22px] font-extrabold leading-none tracking-[-0.01em] text-[#1C1712]">
          {value}
        </span>
        {unit && (
          <span className="ml-[3px] text-xs font-semibold text-[#8A8074]">
            {unit}
          </span>
        )}
      </div>

      {/* Footer can show a trend, warning, or additional context. */}
      {footer && (
        <p
          className="mt-1.5 text-[11.5px] font-semibold"
          style={{ color: footerColor }}
        >
          {footer}
        </p>
      )}
    </article>
  );
}

export default StatCard;
