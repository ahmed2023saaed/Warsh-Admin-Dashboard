import {
    Building2,
    CalendarCheck,
    CreditCard,
    LayoutDashboard,
    Megaphone,
    Settings,
    ShieldUser,
    Star,
    Users,
} from 'lucide-react';

const navItems = [
    { key: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, path: '' },
    { key: 'customers', title: 'Customers', icon: Users, path: 'customers' },
    { key: 'serviceCenters', title: 'Service Centers', icon: Building2, path: 'serviceCenters' },
    { key: 'bookings', title: 'Bookings', icon: CalendarCheck, path: 'bookings' },
    { key: 'payments', title: 'Payments', icon: CreditCard, path: 'payments' },
    { key: 'reviews', title: 'Reviews', icon: Star, path: 'reviews' },
    { key: 'marketing', title: 'Marketing', icon: Megaphone, path: 'marketing' },
    { key: 'settings', title: 'Settings', icon: Settings, path: 'settings' },
    { key: 'adminUsers', title: 'Admin Users', icon: ShieldUser, path: 'adminUsers' },
];

export default navItems;
