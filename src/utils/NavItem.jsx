import {
  Building2,
  CalendarCheck,
  CreditCard,
  Gift,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldUser,
  Star,
  Users,
} from 'lucide-react';

const navItems = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '',
    icon: LayoutDashboard,
    permissionId: 1,
  },

  {
    key: 'customers',
    title: 'Customers',
    path: 'customers',
    icon: Users,
    permissionId: 2,
  },

  {
    key: 'serviceCenters',
    title: 'Service Centers',
    path: 'serviceCenters',
    icon: Building2,
    permissionId: 3,
  },

  {
    key: 'bookings',
    title: 'Bookings',
    path: 'bookings',
    icon: CalendarCheck,
    permissionId: 4,
  },

  {
    key: 'payments',
    title: 'Payments',
    path: 'payments',
    icon: CreditCard,
    permissionId: 5,
  },

  {
    key: 'reviews',
    title: 'Reviews',
    path: 'reviews',
    icon: Star,
    permissionId: 6,
  },

  {
    key: 'marketing',
    title: 'Marketing',
    path: 'marketing',
    icon: Megaphone,
    permissionId: 7,
  },

  {
    key: 'loyalty',
    title: 'Loyalty & Rewards',
    path: 'loyalty',
    icon: Gift,
    // Provisional until the backend defines and assigns a loyalty permission ID.
    permissionId: 10,
  },

  {
    key: 'settings',
    title: 'Settings',
    path: 'settings',
    icon: Settings,
    permissionId: 8,
  },

  {
    key: 'adminUsers',
    title: 'Admin Users',
    path: 'adminUsers',
    icon: ShieldUser,
    permissionId: 9,
  },
];

export default navItems;
