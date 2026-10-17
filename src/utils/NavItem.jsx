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

// Page access comes from PAGE_PERMISSIONS in constants/permissions.js, matched by key
const navItems = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '',
    icon: LayoutDashboard,
  },

  {
    key: 'customers',
    title: 'Customers',
    path: 'customers',
    icon: Users,
  },

  {
    key: 'serviceCenters',
    title: 'Service Centers',
    path: 'serviceCenters',
    icon: Building2,
  },

  {
    key: 'bookings',
    title: 'Bookings',
    path: 'bookings',
    icon: CalendarCheck,
  },

  {
    key: 'payments',
    title: 'Payments',
    path: 'payments',
    icon: CreditCard,
  },

  {
    key: 'reviews',
    title: 'Reviews',
    path: 'reviews',
    icon: Star,
  },

  {
    key: 'marketing',
    title: 'Marketing',
    path: 'marketing',
    icon: Megaphone,
  },

  {
    key: 'loyalty',
    title: 'Loyalty & Rewards',
    path: 'loyalty',
    icon: Gift,
  },

  {
    key: 'settings',
    title: 'Settings',
    path: 'settings',
    icon: Settings,
  },

  {
    key: 'adminUsers',
    title: 'Admin Users',
    path: 'adminUsers',
    icon: ShieldUser,
  },
];

export default navItems;
