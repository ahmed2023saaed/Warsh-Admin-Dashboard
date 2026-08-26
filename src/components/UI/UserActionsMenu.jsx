// components/UI/UserActionsMenu.jsx

import { useEffect, useRef } from 'react';
import {
  Eye,
  Power,
  ShieldCheck,
  UserRoundCog,
} from 'lucide-react';

export default function UserActionsMenu({
  user,
  position,
  onClose,
  onChangeRole,
  onManagePermissions,
  onViewDetails,
  onDeactivate,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, [onClose]);

  
  if (!user || !position) return null;

  const isProtected =
    user.isProtected || user.currentRole === 'super_admin';

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`Actions for ${user.fullName}`}
      className="fixed z-50 w-[210px] overflow-hidden rounded-xl border border-[#DED2C6] bg-white shadow-xl"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="p-1.5">
        <MenuButton
          icon={UserRoundCog}
          label="Change Role"
          onClick={() => {
            onChangeRole(user);
            onClose();
          }}
        />

        <MenuButton
          icon={ShieldCheck}
          label="Manage Permissions"
          onClick={() => {
            onManagePermissions(user);
            onClose();
          }}
        />

        <MenuButton
          icon={Eye}
          label="View Details"
          onClick={() => {
            onViewDetails(user);
            onClose();
          }}
        />
      </div>

      <div className="border-t border-[#E7DED4] p-1.5">
        <MenuButton
          icon={Power}
          label={
            user.status === 'active'
              ? 'Deactivate User'
              : 'Activate User'
          }
          danger={user.status === 'active'}
          disabled={isProtected}
          onClick={() => {
            onDeactivate(user);
            onClose();
          }}
        />
      </div>
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'text-red-500 hover:bg-red-50'
          : 'text-[#17120E] hover:bg-[#F7F3EF]'
      }`}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      />

      <span>{label}</span>
    </button>
  );
}