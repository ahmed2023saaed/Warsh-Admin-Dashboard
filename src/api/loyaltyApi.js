import apiClient from './apiClient';
import { callApi } from './apiRequest';

/**
 * Create a reward customers can redeem with their points.
 *
 * rewardData: { name, description, pointsCost, discountAmount, expiryDays, redemptionLimitPerClient }
 */
export function createLoyaltyReward(rewardData) {
  return callApi(
    'Create reward',
    () => apiClient.post('/Admin/loyalty/rewards', rewardData),
    'Failed to create reward'
  );
}

/**
 * Add or deduct points from a client's wallet.
 * Use a positive amount to add points and a negative amount to deduct them.
 */
export function adjustClientPoints(clientId, { amount, reason }) {
  return callApi(
    'Adjust points',
    () =>
      apiClient.post(`/Admin/loyalty/clients/${clientId}/adjust`, {
        clientId,
        amount,
        reason,
      }),
    'Failed to adjust points'
  );
}
