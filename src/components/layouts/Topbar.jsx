import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import Input from '../UI/Input';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import topbarMock from '../../Data/topbarMock.json';
import reviewsMock from '../../Data/reviewsMock.json';
import Button from '../UI/Button';
import { useAuth } from '../../context/AuthContext';

function capitalizeWords(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getInitials(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
/***************** */
export default function Topbar({ onMenuOpen }) {
  const Navigate = useNavigate();
  const { logout } = useAuth();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const userName = 'saif Fawzy';
  const userRole = 'Super Admin';

  const formattedUserName = capitalizeWords(userName);
  const userInitials = getInitials(userName);

  const location = useLocation();

  function pageDtails() {
    const pageRout = location.pathname.split('/').filter(Boolean).pop();

    const pageKey =
      pageRout === 'en' || pageRout === 'ar'
        ? 'Dashboard'
        : pageRout
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

    return topbarMock[pageKey] || ['Page Not Found', ''];
  }

  const [pageTitle, defaultPageInfo] = pageDtails();
  const PageInfo =
    pageTitle === 'Reviews'
      ? `${reviewsMock.reviews.length.toLocaleString()} customer reviews across all centers`
      : defaultPageInfo;
  const currentRoute = location.pathname.split('/').filter(Boolean).pop();
  const isDashboard = ['en', 'ar', 'dashboard'].includes(currentRoute?.toLowerCase());

  function getFormattedDate() {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }

  const today = getFormattedDate();

  function handleCancel() {
    setIsLogoutOpen(false);
  }

  function handleLogout() {
    logout();
    Navigate('/login');
  }

  /***************** */
  return (
    <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-3 border-b border-[#E8E2D8] bg-[#F6F3EE] px-3 py-3 sm:px-6 lg:px-8 lg:py-5">
      {/* Current page name and its supporting information. */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E8E2D8] bg-white text-[#1C1712] transition-colors hover:border-[#E08B2F] hover:text-[#E08B2F] lg:hidden"
        >
          <Menu aria-hidden="true" size={24} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg leading-tight font-extrabold tracking-[-0.01em] text-[#1C1712] sm:text-[22px]">
            {pageTitle}
          </h1>
          <p className="mt-1 hidden truncate text-[14.5px] text-[#8A8074] sm:block">
            {isDashboard ? `${PageInfo} · ${today}` : PageInfo}
          </p>
        </div>
      </div>

      {/* Search, notifications, and the signed-in admin. */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-[14px]">
        <div className="flex items-center gap-2 sm:gap-[9px]">
          {/* Generated from the first letter of every word in userName. */}
          <div className="relative">
            <button
              type="button"
              aria-label="Log out"
              title="Log out"
              onClick={() => setIsLogoutOpen(true)}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E8E2D8] bg-white p-2 text-[#5A5148] transition-all duration-200 hover:bg-[#E8E2D8] hover:text-[#E08B2F] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40 focus-visible:outline-none"
            >
              <LogOut size={26} strokeWidth={2} color="#5A5148" />
            </button>

            {isLogoutOpen && (
              <div className="absolute top-full right-0 z-30 mt-3 w-72 rounded-2xl border border-[#E8E2D8] bg-[#FFFDFB] p-5 shadow-[0_18px_40px_rgba(28,23,18,0.15)]">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F3EDE5] text-[#E08B2F]">
                    <LogOut size={28} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1C1712]">Confirm logout</p>
                    <p className="text-sm text-[#8A8074]">Are you sure you want to sign out?</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleCancel()}
                    className="flex-1 cursor-pointer rounded-xl border border-[#E8E2D8] bg-[#F7F4EF] px-4 py-3 text-base font-semibold text-[#1C1712] transition-colors hover:border-[#D8C9B7] hover:bg-[#F8F5F1] focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40 focus-visible:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 cursor-pointer rounded-xl border border-transparent bg-[#D94A3D] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#C83F33] focus-visible:ring-2 focus-visible:ring-[#D94A3D]/40 focus-visible:outline-none"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#E08B2F] to-[#C8730A] text-sm font-bold text-white shadow-sm"
          >
            {userInitials}
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm leading-[1.2] font-bold text-[#1C1712]">{formattedUserName}</h3>
            <p className="mt-0.5 text-xs text-[#8A8074]">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
