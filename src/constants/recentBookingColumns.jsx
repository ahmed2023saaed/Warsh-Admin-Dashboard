// constants/recentBookingColumns.jsx

import Avatar from '../components/ui/Avatar';
import StatusBadge from '../components/widgets/statusBadge';

export const RecentBookingColumns = [
  {
    key: 'customer',
    header: 'Customer',
    cellClassName: 'min-w-[165px]',
    render: (booking) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          initials={booking.customer.initials}
          name={booking.customer.name}
          size={28}
        />

        <span className="whitespace-nowrap text-sm font-medium text-[#15201F]">
          {booking.customer.name}
        </span>
      </div>
    ),
  },
  {
    key: 'center',
    header: 'Center',
    cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
    render: (booking) => booking.center,
  },
  {
    key: 'service',
    header: 'Service',
    cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
    render: (booking) => booking.service,
  },
  {
    key: 'price',
    header: 'Amount',
    cellClassName: 'whitespace-nowrap text-sm font-medium text-[#15201F]',
    render: (booking) =>
      `${booking.price.toLocaleString('en-EG')} EGP`,
  },
  {
    key: 'status',
    header: 'Status',
    render: (booking) => (
      <StatusBadge status={booking.status} />
    ),
  },
];