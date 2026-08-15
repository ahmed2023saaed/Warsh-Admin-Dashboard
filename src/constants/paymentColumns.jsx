// constants/paymentColumns.jsx

import Avatar from '../components/ui/Avatar';
import StatusBadge from '../components/widgets/statusBadge';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date) => {
  if (!date) return '—';

  return new Intl.DateTimeFormat('en-EG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const dateColumn = {
  key: 'date',
  header: 'Date',
  cellClassName: 'whitespace-nowrap text-sm text-[#5A6968]',
  render: (payment) => formatDate(payment.date),
};

const serviceCenterColumn = {
  key: 'serviceCenter',
  header: 'Service Center',
  cellClassName: 'min-w-[180px]',
  render: (payment) => (
    <div className="flex items-center gap-2.5">
      <Avatar
        initials={getInitials(payment.serviceCenter)}
        name={payment.serviceCenter}
        size={32}
      />

      <span className="whitespace-nowrap text-sm font-medium text-[#15201F]">
        {payment.serviceCenter}
      </span>
    </div>
  ),
};

const paymentMethodColumn = {
  key: 'paymentMethod',
  header: 'Payment Method',
  cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
};

const statusColumn = {
  key: 'status',
  header: 'Status',
  render: (payment) => <StatusBadge status={payment.status} />,
};

export function getPaymentColumns(activeTab) {
  const columnsByTab = {
    bookingFees: [
      dateColumn,
      serviceCenterColumn,
      {
        key: 'customer',
        header: 'Customer',
        cellClassName: 'min-w-[170px]',
        render: (payment) => (
          <div className="flex items-center gap-2.5">
            <Avatar
              initials={getInitials(payment.customer)}
              name={payment.customer}
              size={32}
            />

            <span className="whitespace-nowrap text-sm font-medium text-[#15201F]">
              {payment.customer}
            </span>
          </div>
        ),
      },
      {
        key: 'bookingFee',
        header: 'Booking Fee',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[#15201F]',
        render: (payment) => formatCurrency(payment.bookingFee),
      },
      paymentMethodColumn,
      statusColumn,
    ],

    subscriptions: [
      dateColumn,
      serviceCenterColumn,
      {
        key: 'amount',
        header: 'Amount',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[#15201F]',
        render: (payment) => formatCurrency(payment.amount),
      },
      paymentMethodColumn,
      statusColumn,
      {
        key: 'renewalDate',
        header: 'Renewal Date',
        cellClassName: 'whitespace-nowrap text-sm text-[#5A6968]',
        render: (payment) => formatDate(payment.renewalDate),
      },
    ],

    marketing: [
      dateColumn,
      serviceCenterColumn,
      {
        key: 'campaign',
        header: 'Campaign',
        cellClassName: 'min-w-[220px] text-sm font-medium text-[#15201F]',
      },
      {
        key: 'amount',
        header: 'Amount',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[#15201F]',
        render: (payment) => formatCurrency(payment.amount),
      },
      paymentMethodColumn,
      statusColumn,
    ],

    commissions: [
      dateColumn,
      serviceCenterColumn,
      {
        key: 'commissionRate',
        header: 'Commission Rate',
        cellClassName:
          'whitespace-nowrap text-sm font-medium text-[#15201F]',
        render: (payment) => `${payment.commissionRate}%`,
      },
      {
        key: 'commissionAmount',
        header: 'Commission Amount',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[#15201F]',
        render: (payment) => formatCurrency(payment.commissionAmount),
      },
      statusColumn,
      {
        key: 'totalPrice',
        header: 'Total Price',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[#15201F]',
        render: (payment) => formatCurrency(payment.totalPrice),
      },
    ],

    refunds: [
      dateColumn,
      serviceCenterColumn,
      {
        key: 'customer',
        header: 'Customer',
        cellClassName: 'min-w-[170px]',
        render: (payment) => {
          if (!payment.customer) {
            return <span className="text-gray-400">—</span>;
          }

          return (
            <div className="flex items-center gap-2.5">
              <Avatar
                initials={getInitials(payment.customer)}
                name={payment.customer}
                size={32}
              />

              <span className="whitespace-nowrap text-sm font-medium text-[#15201F]">
                {payment.customer}
              </span>
            </div>
          );
        },
      },
      {
        key: 'originalTransaction',
        header: 'Transaction',
        cellClassName: 'whitespace-nowrap text-sm text-[#15201F]',
      },
      {
        key: 'originalTransactionId',
        header: 'Transaction ID',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[#5A6968]',
      },
      {
        key: 'refundAmount',
        header: 'Amount',
        cellClassName:
          'whitespace-nowrap text-sm font-semibold text-[var(--red)]',
        render: (payment) => formatCurrency(payment.refundAmount),
      },
      paymentMethodColumn,
      statusColumn,
      {
        key: 'reason',
        header: 'Reason',
        cellClassName:
          'min-w-[250px] max-w-[320px] text-sm text-[#5A6968]',
      },
    ],
  };

  return columnsByTab[activeTab] ?? [];
}