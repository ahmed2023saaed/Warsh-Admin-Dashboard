// components/ui/CustomerStatusBadge.jsx

const statusStyles = {
  active: {
    label: 'Active',
    className: 'bg-[var(--green-bg)] text-[var(--green)]',
  },

  suspended: {
    label: 'Suspended',
    className: 'bg-[var(--red-bg)] text-[var(--red)]',
  },

  new: {
    label: 'New',
    className: 'bg-[#f0edea] text-[var(--ink-dim)]',
  },
};

export default function CustomerStatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();
  const statusConfig = statusStyles[normalizedStatus];

  if (!statusConfig) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
        {status || 'Unknown'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusConfig.className}`}
    >
      {statusConfig.label}
    </span>
  );
}