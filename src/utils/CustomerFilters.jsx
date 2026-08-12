
import { Star } from 'lucide-react';
import Avatar from '../components/UI/Avatar';
import StatusBadge from '../components/widgets/statusBadge';



export const customerFilters = [
    {key: 'all', label: 'All'},
    {key: 'active', label: 'Active'},
    {key: 'suspended', label: 'Suspended'},
    {key: 'new', label: 'New This Month'},
]


export const customerColumns = [
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
      const initials = customer.fullName
        .split(' ')
        .map((name) => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      return (
        <div className="flex items-center gap-2.5">
          <Avatar
            initials={initials}
            name={customer.fullName}
            size={32}
          />

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
        href={`tel:${customer.phone.replace(/\s/g, '')}`}
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
    key: 'ratingGiven',
    header: 'Rating',
    align: 'center',
    cellClassName: 'text-sm',
    render: (customer) => {
      if (customer.ratingGiven === null) {
        return <span className="text-gray-400">Not rated</span>;
      }

      return (
        <div className="inline-flex items-center gap-1">
          <Star
            className="h-4 w-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />

          <span className="font-semibold text-[#15201F]">
            {customer.ratingGiven.toFixed(1)}
          </span>
        </div>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    render: (customer) => (
      <StatusBadge status={customer.status} />
    ),
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
            setSelectedCustomer(customer);
            }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#0E5C5B] transition-colors hover:border-[#0E5C5B] hover:bg-teal-50"
            aria-label={`View ${customer.fullName}`}
        >
            View
        </button>

        <button
            type="button"
            onClick={(event) => {
            event.stopPropagation();
            handleSuspendCustomer(customer);
            }}
            disabled={customer.status === 'suspended'}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Suspend ${customer.fullName}`}
        >
            {customer.status === 'suspended' ? 'Suspended' : 'Suspend'}
        </button>
        </div>
    ),
},
];



const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();


export const filters = (customers,{search='', tap ='all'})=> {
    const normalizedSearch = normalizeText(search);

    return customers.filter((customer)=>{
            const currentTap = 
            customer.status === tap ||
            tap === 'all'

            const matchedSearch = !normalizedSearch ||
            [customer.fullName , customer.phone].some((item) => normalizeText(item).includes(normalizedSearch) )

            return currentTap && matchedSearch

        })  
}
