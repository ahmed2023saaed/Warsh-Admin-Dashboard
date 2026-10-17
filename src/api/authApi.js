import apiClient from './apiClient';

export async function getPermissions() {
  try {
    const response = await apiClient.get('/Admin/permissions');
    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Failed to get permissions');
    }

    return data.data;
  } catch (error) {
    console.error('Get permissions failed:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.data?.title || 'Failed to get permissions'
      );
    }

    if (error.request) {
      throw new Error('Unable to reach the server.');
    }

    throw error;
  }
}

export async function getUserPermissions(userId) {
  try {
    const response = await apiClient.get(`/Admin/user-permissions/${userId}`);

    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Failed to get user permissions');
    }

    return data.data;
  } catch (error) {
    console.error('Get user permissions failed:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.title ||
          'Failed to get user permissions'
      );
    }

    if (error.request) {
      throw new Error('Unable to reach the server.');
    }

    throw error;
  }
}

/******************LOGIN*****************/
export async function loginAdmin({ email, password }) {
  try {
    const response = await apiClient.post('/Admin/login', {
      email,
      password,
    });

    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Login failed');
    }

    const adminData = data.data;

    // Save authentication data FIRST
    localStorage.setItem('accessToken', adminData.accessToken);
    localStorage.setItem('refreshToken', adminData.refreshToken);
    localStorage.setItem('accessTokenExpiresAt', adminData.expiresAt);

    // Save basic admin information
    localStorage.setItem(
      'adminUser',
      JSON.stringify({
        userId: adminData.id,
        email: adminData.email,
      })
    );

    // NOW get this user's permissions
    let userPermissions = [];

    try {
      userPermissions = await getUserPermissions(adminData.id);

      console.log('USER PERMISSIONS:', userPermissions);

      localStorage.setItem('adminPermissions', JSON.stringify(userPermissions));
    } catch (error) {
      console.error('Could not get user permissions:', error.message);

      localStorage.setItem('adminPermissions', JSON.stringify([]));
    }

    // Remove old authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('loginResponse');

    return {
      ...adminData,
      permissions: userPermissions,
    };
  } catch (error) {
    console.error('Admin login failed:', error);

    if (error.response) {
      const message = error.response.data?.message || error.response.data?.title || 'Login failed';

      throw new Error(message);
    }

    if (error.request) {
      throw new Error('Unable to reach the login server. Check CORS or the API connection.');
    }

    throw error;
  }
}

export function logoutAdmin() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessTokenExpiresAt');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminPermissions');
  // Clean old authentication keys
  localStorage.removeItem('user');
  localStorage.removeItem('loginResponse');
}
