// constants/adminUserColumns.jsx

import { MoreVertical } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import StatusBadge from '../components/widgets/statusBadge';

const roleStyles = {
  super_admin: {
    label: 'Super Admin',
    className: 'bg-purple-100 text-purple-700',
  },
  admin: {
    label: 'Admin',
    className: 'bg-blue-100 text-blue-700',
  },
  manager: {
    label: 'Manager',
    className: 'bg-gray-100 text-gray-700',
  },
  finance: {
    label: 'Finance',
    className: 'bg-emerald-100 text-emerald-700',
  },
  operations: {
    label: 'Operations',
    className: 'bg-orange-100 text-orange-700',
  },
  marketing: {
    label: 'Marketing',
    className: 'bg-pink-100 text-pink-700',
  },
  customer_support: {
    label: 'Customer Support',
    className: 'bg-amber-100 text-amber-700',
  },
};

export function getAdminUserColumns({ onOpenActions }) {
  return [
    {
      key: 'fullName',
      header: 'User',
      headerClassName: '!text-left pl-4',
      cellClassName: '!text-left min-w-[230px]',
      render: (user) => (
        <div className="flex items-center gap-2.5">
          <Avatar
            initials={user.initials}
            name={user.fullName}
            image={user.avatar}
            size={34}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#17120E]">
              {user.fullName}
            </p>

            <p className="truncate text-xs text-[#6B625C]">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'currentRole',
      header: 'Current Role',
      cellClassName: 'min-w-[150px]',
      render: (user) => {
        const role = roleStyles[user.currentRole];

        return (
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${
              role?.className ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            {role?.label ?? user.currentRole}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      cellClassName: 'min-w-[110px]',
      render: (user) => (
        <StatusBadge status={user.status} />
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      cellClassName:
        'min-w-[130px] whitespace-nowrap text-sm text-[#5A6968]',
      render: (user) => user.lastActive,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: '!text-right pr-4',
      cellClassName: '!text-right',
      render: (user) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenActions(user);
          }}
          className="inline-flex rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label={`Open actions for ${user.fullName}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ),
    },
  ];
}