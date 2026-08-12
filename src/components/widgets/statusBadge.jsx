// components/ui/StatusBadge.jsx

const statusStyles = {
  // Shared status
  active: {
    label: 'Active',
    className: 'bg-[var(--green-bg)] text-[var(--green)]',
  },

  // Customer statuses
  suspended: {
    label: 'Suspended',
    className: 'bg-[var(--red-bg)] text-[var(--red)]',
  },
  new: {
    label: 'New',
    className: 'bg-[#f0edea] text-[var(--ink-dim)]',
  },

  // Booking statuses
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-50 text-blue-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-[var(--red-bg)] text-[var(--red)]',
  },
};

export default function StatusBadge({
  status,
  className = '',
}) {
  const normalizedStatus = String(status || '')
    .trim()
    .toLowerCase();

  const config = statusStyles[normalizedStatus];

  if (!config) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 ${className}`}
      >
        {status || 'Unknown'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}