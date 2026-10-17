import { Outlet, useLocation } from 'react-router-dom';
import { LanguageProvider } from '../../context/languageContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useEffect, useState } from 'react';

export default function AppLayout() {
  return (
    <LanguageProvider>
      <InnerLayout />
    </LanguageProvider>
  );
}

function InnerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const onMobileSidebarClose = () => setMobileOpen(false);
  const onCollapse = () => setCollapsed((open) => !open);

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);

    // /en → Dashboard
    const page = parts[1] || 'dashboard';

    const pageTitles = {
      dashboard: 'Dashboard',
      customers: 'Customers',
      serviceCenters: 'Service Centers',
      bookings: 'Bookings',
      payments: 'Payments',
      reviews: 'Reviews',
      marketing: 'Marketing',
      loyalty: 'Loyalty & Rewards',
      settings: 'Settings',
      adminUsers: 'Admin Users',
    };

    document.title = `${pageTitles[page] || 'Dashboard'} | Warsha`;
  }, [location.pathname]);

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f6f3ee]">
      <Sidebar
        collapsed={collapsed}
        onCollapse={onCollapse}
        onMobileSidebarClose={onMobileSidebarClose}
        mobileOpen={mobileOpen}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onMobileSidebarClose}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuOpen={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto bg-[#f6f3ee] px-3 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-12 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
