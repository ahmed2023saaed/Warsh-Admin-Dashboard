import { createContext, useContext, useEffect, useState } from 'react';
import { logoutAdmin, toPermissionIds } from '../api/authApi';
import { PAGE_PERMISSIONS } from '../constants/permissions';
import navItems from '../utils/NavItem';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const storedPermissions = localStorage.getItem('adminPermissions');
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];

        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          // Older logins saved the raw response, so normalize it here too
          setPermissions(toPermissionIds(parsedPermissions));
        } else {
          logoutAdmin();
        }
      } catch (error) {
        console.error('Failed to restore authentication:', error);
        logoutAdmin();
      }
    }

    setLoading(false);
  }, []);

  const login = (adminData) => {
    const userData = {
      userId: adminData.id,
      email: adminData.email,
    };

    setUser(userData);
    setPermissions(toPermissionIds(adminData.permissions));
  };

  const logout = () => {
    logoutAdmin();
    setUser(null);
    setPermissions([]);
  };

  const isSuperAdmin = user?.email === 'superadmin@warsha.app';

  // permissionId is a backend id, see PERMISSIONS in constants/permissions.js
  const hasPermission = (permissionId) => {
    return isSuperAdmin || permissions.includes(permissionId);
  };

  // page is a NavItem key, e.g. 'bookings'
  const canAccessPage = (page) => {
    return (PAGE_PERMISSIONS[page] || []).some(hasPermission);
  };

  // Where to send users who can't open the dashboard
  const firstAllowedPage = navItems.find((item) => canAccessPage(item.key)) || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        login,
        logout,
        hasPermission,
        canAccessPage,
        firstAllowedPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
};
