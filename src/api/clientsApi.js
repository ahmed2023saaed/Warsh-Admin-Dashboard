import apiClient from './apiClient';

// Status values for GET /Admin/clients. Swagger only lists 0-3 without names;
// these follow the order of `counts` in the response (all, active, suspended, new).
// 'all' sends no Status at all.
const STATUS_FILTERS = {
  active: 1,
  suspended: 2,
  new: 3,
};

// Returns { items, page, pageSize, totalCount, totalPages, counts: { all, active, suspended, new } }
export async function getClients({ page = 1, pageSize = 10, search = '', status = 'all' } = {}) {
  try {
    const response = await apiClient.get('/Admin/clients', {
      params: {
        Page: page,
        PageSize: pageSize,
        Search: search || undefined,
        Status: STATUS_FILTERS[status],
      },
    });

    const data = response.data;

    if (!data.isSuccess) {
      throw new Error(data.message || 'Failed to load customers');
    }

    return data.data;
  } catch (error) {
    console.error('Get clients failed:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || error.response.data?.title || 'Failed to load customers',
        { cause: error }
      );
    }

    if (error.request) {
      throw new Error('Unable to reach the server. Please check your connection.', {
        cause: error,
      });
    }

    throw error;
  }
}
