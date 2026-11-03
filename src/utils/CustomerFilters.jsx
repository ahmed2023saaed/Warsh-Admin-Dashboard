import { Star } from 'lucide-react';
import Avatar from '../components/UI/Avatar';
import StatusBadge from '../components/widgets/statusBadge';

export const customerFilters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'new', label: 'New This Month' },
];

export function createCustomerColumns({ onView, onSuspend }) {
  return [
    // {
    //   key: 'id',
    //   header: 'Customer ID',
    //   cellClassName: 'text-sm font-medium text-[#5A6968]',
    //   render: (customer) => customer.id,
    // },
    {
      key: 'fullName',
      header: 'Customer',
      render: (customer) => {
        const initials = (customer.fullName || '')
          .split(' ')
          .map((name) => name[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-2.5">
            <Avatar initials={initials} name={customer.fullName} size={32} />

            <span className="text-sm font-medium whitespace-nowrap text-[#15201F]">
              {customer.fullName}
            </span>
          </div>
        );
      },
    },
    {
      key: 'phone',
      header: 'Phone',
      cellClassName: 'text-sm whitespace-nowrap text-[#5A6968]',
      render: (customer) => (
        <a
          href={`tel:${(customer.phone || '').replace(/\s/g, '')}`}
          className="transition-colors hover:text-[#0E5C5B]"
        >
          {customer.phone}
        </a>
      ),
    },
    {
      key: 'carsCount',
      header: 'Cars',
      align: 'center',
      cellClassName: 'text-sm font-medium text-[#15201F]',
      render: (customer) => customer.carsCount,
    },
    {
      key: 'bookingsCount',
      header: 'Bookings',
      align: 'center',
      cellClassName: 'text-sm font-medium text-[#15201F]',
      render: (customer) => customer.bookingsCount,
    },
    {
      key: 'totalSpending',
      header: 'Total Spending',
      cellClassName: 'text-sm font-semibold whitespace-nowrap text-[#15201F]',
      render: (customer) =>
        new Intl.NumberFormat('en-EG', {
          style: 'currency',
          currency: 'EGP',
          maximumFractionDigits: 0,
        }).format(customer.totalSpending),
    },

    {
      key: 'status',
      header: 'Status',
      render: (customer) => <StatusBadge status={customer.status} />,
    },
    // {
    //   key: 'createdAt',
    //   header: 'Joined Date',
    //   cellClassName: 'text-sm whitespace-nowrap text-[#5A6968]',
    //   render: (customer) =>
    //     new Intl.DateTimeFormat('en-EG', {
    //       day: '2-digit',
    //       month: 'short',
    //       year: 'numeric',
    //     }).format(new Date(`${customer.createdAt}T00:00:00`)),
    // },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (customer) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onView(customer);
            }}
            className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#0E5C5B] transition-colors hover:border-[#0E5C5B] hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-[#0E5C5B]/30 focus-visible:outline-none"
            aria-label={`View ${customer.fullName}`}
          >
            View
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSuspend(customer.id);
            }}
            className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Suspend ${customer.fullName}`}
          >
            {customer.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
          </button>
        </div>
      ),
    },
  ];
}

/** "2026-10-18T17:17:49Z" → { date: "18 Oct 2026", time: "7:17 PM" }; anything else is shown as it is. */
function splitDateTime(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return { date: value || '—', time: '' };

  return {
    date: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date),
  };
}

// booking_completed → "Booking completed". The color follows what happened (checked in this
// order), so booking_completed is green and booking_rejected is red.
const ACTIVITY_STYLES = {
  rejected: 'bg-[#FDECEC] text-[#D64545]',
  cancelled: 'bg-[#FDECEC] text-[#D64545]',
  suspend: 'bg-[#FDECEC] text-[#D64545]',
  completed: 'bg-[#EAF8EF] text-[#169447]',
  payment: 'bg-[#EAF8EF] text-[#169447]',
  review: 'bg-[#FDF1DE] text-[#C8790A]',
  created: 'bg-[#EAF1FE] text-[#2F6FED]',
  booking: 'bg-[#EAF1FE] text-[#2F6FED]',
};

function activityLabel(type = '') {
  const text = String(type).replace(/[_-]+/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '—';
}

export function creatActivityTable() {
  return [
    {
      key: 'type',
      header: 'Activity',
      cellClassName: '!text-left',
      headerClassName: '!text-left',
      render: (activity) => {
        const kind = Object.keys(ACTIVITY_STYLES).find((key) =>
          String(activity.type).toLowerCase().includes(key)
        );

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
              ACTIVITY_STYLES[kind] ?? 'bg-[#F3EFE9] text-[#6F665C]'
            }`}
          >
            {activityLabel(activity.type)}
          </span>
        );
      },
    },
    {
      key: 'description',
      header: 'Description',
      cellClassName: '!text-left max-w-[260px] leading-5 break-words whitespace-normal',
      headerClassName: '!text-left',
      render: (activity) => (
        <p className="text-[#1C1712]" title={activity.description}>
          {activity.description || '—'}
        </p>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cellClassName: '!text-left whitespace-nowrap',
      headerClassName: '!text-left',
      render: (activity) => {
        const { date, time } = splitDateTime(activity.date);

        return (
          <div className="flex flex-col">
            <span className="font-medium text-[#1C1712]">{date}</span>
            {time && <span className="text-xs text-[#8A8074]">{time}</span>}
          </div>
        );
      },
    },
  ];
}

/** Cars from GET /Admin/clients/{id}: { id, brand, model, year, plateNumber } */
export function createCarColumns() {
  return [
    {
      key: 'car',
      header: 'Car',
      cellClassName: '!text-left',
      headerClassName: '!text-left',
      render: (car) => (
        <p className="font-semibold whitespace-nowrap text-[#1C1712]">
          {[car.brand, car.model].filter(Boolean).join(' ') || '—'}
        </p>
      ),
    },
    {
      key: 'year',
      header: 'Year',
      render: (car) => <p>{car.year || '—'}</p>,
    },
    {
      key: 'plateNumber',
      header: 'Plate number',
      render: (car) =>
        car.plateNumber ? (
          <span className="inline-flex rounded-md border border-[#E8E2D8] bg-[#FDFBF8] px-2 py-0.5 font-mono text-xs font-semibold text-[#1C1712]">
            {car.plateNumber}
          </span>
        ) : (
          <span className="text-[#A0978D]">—</span>
        ),
    },
  ];
}

export const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export const filters = (customers, { search = '', tap = 'all' }) => {
  const normalizedSearch = normalizeText(search);

  return customers.filter((customer) => {
    const currentTap = customer.status === tap || tap === 'all';

    const matchedSearch =
      !normalizedSearch ||
      [customer.fullName, customer.phone].some((item) =>
        normalizeText(item).includes(normalizedSearch)
      );

    return currentTap && matchedSearch;
  });
};
