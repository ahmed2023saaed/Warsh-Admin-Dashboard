import apiClient from './apiClient';
import { callApi } from './apiRequest';

// POST /Admin/verify-workshop/{id}: accepts a workshop so it can sign in
export function verifyWorkshop(id) {
  return callApi(
    'Accept workshop',
    () => apiClient.post(`/Admin/verify-workshop/${id}`),
    'Failed to accept workshop'
  );
}

// POST /Admin/unverify-workshop/{id}: takes the verification back
export function unverifyWorkshop(id) {
  return callApi(
    'Reject workshop',
    () => apiClient.post(`/Admin/unverify-workshop/${id}`),
    'Failed to reject workshop'
  );
}
