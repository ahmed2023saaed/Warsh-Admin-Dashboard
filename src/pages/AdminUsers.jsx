import { useMemo, useState } from 'react';
import StatCard from '../components/UI/StatCard';
import { rolesPermissionsMockData } from '../Data/rolesPermissionsMockData'
import { getAdminUserColumns } from '../constants/adminUserColumns';
import { Search } from 'lucide-react';
import FilterSelect from '../components/UI/FilterSelect';
import { filterAdminUsers } from '../utils/filterAdminUsers';
import DataTable from '../components/UI/DataTable';





function AdminUsers() {

  const cards = rolesPermissionsMockData.summary
  const [selectedUser, setselectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(null)
  const [search, setSearch] = useState('')

  const users = rolesPermissionsMockData.users
  const roleOptions = rolesPermissionsMockData.roles
  const statusOptions = rolesPermissionsMockData.statuses
  const adminColumns = useMemo(
    () => getAdminUserColumns({ onOpenActions: setselectedUser }),
    []
  )

  const filteredUsers = useMemo(
    () =>
      filterAdminUsers(users, {
        search,
        role: selectedRole,
        status: selectedStatus,
      }),
    [users, search, selectedRole, selectedStatus]
  );

  console.log("inside admin", filteredUsers)
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-4'>
        {cards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBg={card.iconBg}
            title={card.title}
            value={card.value}
            unit={''}
            footer={card.description}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3   sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search user..."
          className="h-10 w-full rounded-lg border border-[#DED2C6] bg-white px-3 text-sm outline-none focus:border-[#E4790B] focus:ring-2 focus:ring-[#E4790B]/10 sm:max-w-[280px]"
        />

        <FilterSelect
          value={selectedRole}
          onChange={(role) => {
            setSelectedRole(role);
            setCurrentPage(1);
          }}
          options={roleOptions}
          ariaLabel="Filter users by role"
          className="w-full sm:w-[150px]"
        />

        <FilterSelect
          value={selectedStatus}
          onChange={(status) => {
            setSelectedStatus(status);
            setCurrentPage(1);
          }}
          options={statusOptions}
          ariaLabel="Filter users by status"
          className="w-full sm:w-[150px]"
        />
      </div>

      <DataTable
        columns={adminColumns}
        data={filteredUsers}
        emptyMessage="No users match the selected filters."
        minWidth="850px"
        cellClassName="text-sm"
      />

    </div>
  );
}

export default AdminUsers;
