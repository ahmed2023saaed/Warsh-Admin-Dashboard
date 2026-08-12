import { Eye } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import StatusBadge from '../components/widgets/statusBadge';
import {normalizeText} from '../utils/CustomerFilters'

export const createBookingColumns = ({ onView }) => [
//   {
//     key: 'id',
//     header: 'Booking ID',
//     cellClassName: 'whitespace-nowrap text-sm font-semibold text-[#5A6968]',
//     render: (booking) => `#${booking.id}`,
//   },
  {
    key: 'customer',
    header: 'Customer',
    cellClassName: 'min-w-[180px]',
    render: (booking) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          initials={booking.customer.initials}
          name={booking.customer.name}
          size={32}
        />

        <span className="whitespace-nowrap text-sm font-medium text-[#15201F]">
          {booking.customer.name}
        </span>
      </div>
    ),
  },
  {
    key: 'center',
    header: 'Service Center',
    cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
    render: (booking) => booking.center,
  },
  {
    key: 'car',
    header: 'Car',
    cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
    render: (booking) => booking.car,
  },
  {
    key: 'service',
    header: 'Service',
    cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
    render: (booking) => booking.service,
  },
  {
    key: 'price',
    header: 'Price',
    cellClassName: 'whitespace-nowrap text-sm font-semibold text-[#15201F]',
    render: (booking) => `${booking.price.toLocaleString('en-EG')} EGP`,
  },
  {
    key: 'fee',
    header: 'Fees',
    cellClassName: 'whitespace-nowrap text-sm text-[#5A6968]',
    render: (booking) => `${booking.fee.toLocaleString('en-EG')} EGP`,
  },
  {
    key: 'commission',
    header: 'Commission',
    cellClassName: 'whitespace-nowrap text-sm font-medium text-[#15201F]',
    render: (booking) => `${booking.commission.toLocaleString('en-EG')} EGP`,
  },
  {
    key: 'paymentMethod',
    header: 'Payment',
    cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
    render: (booking) => booking.paymentMethod,
  },
  {
    key: 'status',
    header: 'Status',
    render: (booking) => (
      <StatusBadge status={booking.status} />
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    cellClassName: 'whitespace-nowrap',
    render: (booking) => (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onView(booking);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#0E5C5B] transition-colors hover:border-[#0E5C5B] hover:bg-teal-50"
        aria-label={`View booking ${booking.id}`}
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>
    ),
  },
];





 export function FilterBookings(bookings, { tab = 'all' }) {
  return bookings.filter(
    (booking) => tab === 'all' || booking.status === tab
  );
}