import { createContext, useContext, useEffect, useState } from 'react';
import { logoutAdmin } from '../api/authApi';

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
          setPermissions(parsedPermissions);
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
    setPermissions(Array.isArray(adminData.permissions) ? adminData.permissions : []);
  };

  const logout = () => {
    logoutAdmin();
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (permissionId) => {
    const isSuperAdmin = user?.email === 'superadmin@warsha.app';

    if (isSuperAdmin) {
      return true;
    }

    return permissions.includes(permissionId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        login,
        logout,
        hasPermission,
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
