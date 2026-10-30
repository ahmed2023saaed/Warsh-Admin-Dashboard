import apiClient from './apiClient';

export async function createAdminUser(adminData, role) {
  try {
    const endpoint = role === 'admin' ? '/Admin/create-admin' : '/Admin/create-employee';

    const response = await apiClient.post(endpoint, adminData);

    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Failed to create user');
    }

    return data;
  } catch (error) {
    console.error('Create user failed:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.data?.title || 'Failed to create user'
      );
    }

    if (error.request) {
      throw new Error('Unable to reach the server. Please check your connection.');
    }

    throw error;
  }
}
