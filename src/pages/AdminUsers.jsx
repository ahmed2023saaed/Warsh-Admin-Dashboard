import { useMemo, useState } from 'react';
import StatCard from '../components/UI/StatCard';
import { rolesPermissionsMockData } from '../Data/rolesPermissionsMockData';
import { getAdminUserColumns } from '../constants/adminUserColumns';
import { Search, UserPlus } from 'lucide-react';
import FilterSelect from '../components/UI/FilterSelect';
import { filterAdminUsers } from '../utils/filterAdminUsers';
import DataTable from '../components/UI/DataTable';
import UserActionsMenu from '../components/UI/UserActionsMenu';
import Pagination from '../utils/Pagination';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import AddEmployee from '../utils/AddEmployee';

function AdminUsers() {
  const cards = rolesPermissionsMockData.summary;
  const [actionMenu, setActionMenu] = useState({
    user: null,
    position: null,
  });
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);

  const users = rolesPermissionsMockData.users;
  const roleOptions = rolesPermissionsMockData.roles;
  const statusOptions = rolesPermissionsMockData.statuses;

  const filteredUsers = useMemo(
    () =>
      filterAdminUsers(users, {
        search,
        role: selectedRole,
        status: selectedStatus,
      }),
    [users, search, selectedRole, selectedStatus]
  );

  const handleOpenActions = (user, event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();

    const menuWidth = 210;
    const menuHeight = 210;
    const screenPadding = 12;

    let top = buttonRect.bottom + 6;
    let left = buttonRect.right - menuWidth;

    // Prevent menu from leaving the left side
    left = Math.max(left, screenPadding);
    // Prevent menu from leaving the right side
    left = Math.min(left, window.innerWidth - menuWidth - screenPadding);

    // Open upward if there isn't enough space below
    if (top + menuHeight > window.innerHeight) {
      top = buttonRect.top - menuHeight - 6;
    }

    setActionMenu({
      user,
      position: {
        top,
        left,
      },
    });
  };

  const adminColumns = useMemo(() => getAdminUserColumns({ onOpenActions: handleOpenActions }), []);

  const handleChangeRole = (user) => {
    console.log('Change role:', user);

    // Later:
    // setRoleModalUser(user);
  };

  const handleManagePermissions = (user) => {
    console.log('Manage permissions:', user);

    // Later:
    // navigate(`/admin-users/${user.id}/permissions`);
  };

  const handleViewDetails = (user) => {
    console.log('View user:', user);

    // Later:
    // setDetailsUser(user);
  };

  const handleToggleUserStatus = (user) => {
    console.log('Toggle status:', user);

    // Later, call your API or context:
    // updateUserStatus(user.id);
  };

  console.log('inside admin', filteredUsers);
  return (
    <div className="min-w-0 space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          icon={Search}
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          placeholder="Search user..."
          className="h-10 w-full rounded-lg border border-[#DED2C6] bg-white px-3 text-sm outline-none focus:border-[#E4790B] focus:ring-2 focus:ring-[#E4790B]/10 sm:max-w-[280px]"
        />

        <FilterSelect
          value={selectedRole}
          onChange={(role) => {
            setSelectedRole(role);
          }}
          options={roleOptions}
          ariaLabel="Filter users by role"
          className="w-full sm:w-[150px]"
        />

        <FilterSelect
          value={selectedStatus}
          onChange={(status) => {
            setSelectedStatus(status);
          }}
          options={statusOptions}
          ariaLabel="Filter users by status"
          className="w-full sm:w-[150px]"
        />

        <Button
          onClick={() => setOpenAddEmployee(true)}
          className="group min-h-[42px] w-full gap-2 !rounded-[12px] !border-[#1C1712] !bg-[#1C1712] !py-2 !pr-5 !pl-2 !text-sm !font-bold !text-white shadow-[0_4px_12px_rgba(28,23,18,0.12)] transition-colors hover:!border-[#1C1712] hover:!bg-[#2A211C] sm:ml-auto sm:w-auto"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white">
            <UserPlus size={16} strokeWidth={2} />
          </span>
          Add Employee
        </Button>
      </div>

      <Modal
        open={openAddEmployee}
        onClose={() => setOpenAddEmployee(false)}
        title="Add Employee"
        size="lg"
        className="border border-[#E8E2D8]"
        contentClassName="!py-5"
      >
        <AddEmployee onSuccess={() => setOpenAddEmployee(false)} />
      </Modal>
      <DataTable
        columns={adminColumns}
        data={paginatedUsers}
        emptyMessage="No users match the selected filters."
        minWidth="850px"
        cellClassName="text-sm"
      />
      <Pagination data={filteredUsers} perPage={10} onPaginate={setPaginatedUsers} />

      <UserActionsMenu
        user={actionMenu.user}
        position={actionMenu.position}
        onClose={() =>
          setActionMenu({
            user: null,
            position: null,
          })
        }
        onChangeRole={handleChangeRole}
        onManagePermissions={handleManagePermissions}
        onViewDetails={handleViewDetails}
        onDeactivate={handleToggleUserStatus}
      />
    </div>
  );
}

export default AdminUsers;
