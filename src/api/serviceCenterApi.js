import apiClient from './apiClient';

export async function verifyWorkshop(id) {
  try {
    const response = await apiClient.post(`/Admin/verify-workshop/${id}`);

    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Failed to accept workshop');
    }

    return data;
  } catch (error) {
    console.error('Accept workshop failed:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.data?.title || 'Failed to accept workshop'
      );
    }

    if (error.request) {
      throw new Error('Unable to reach the server. Please check your connection.');
    }

    throw error;
  }
}

export async function unverifyWorkshop(id) {
  try {
    const response = await apiClient.post(`/Admin/unverify-workshop/${id}`);

    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Failed to reject workshop');
    }

    return data;
  } catch (error) {
    console.error('Reject workshop failed:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.data?.title || 'Failed to reject workshop'
      );
    }

    if (error.request) {
      throw new Error('Unable to reach the server. Please check your connection.');
    }

    throw error;
  }
}
