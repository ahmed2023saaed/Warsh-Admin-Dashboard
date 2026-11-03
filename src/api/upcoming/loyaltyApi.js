/**
 * Loyalty page — API_ENDPOINTS.xlsx rows #48–#52 (not live yet).
 * Create reward (#46) and adjust points (#47) are live in ../loyaltyApi.js.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { getList } from './helpers';

/** Reward form values → the API body (numbers as numbers, empty limit → null). */
function rewardBody({
  name,
  description,
  pointsCost,
  discountAmount,
  expiryDays,
  redemptionLimitPerClient,
}) {
  const toNumber = (value) => (value === '' || value == null ? null : Number(value));

  return {
    name: String(name ?? '').trim(),
    description: String(description ?? '').trim(),
    pointsCost: toNumber(pointsCost),
    discountAmount: toNumber(discountAmount),
    expiryDays: toNumber(expiryDays),
    redemptionLimitPerClient: toNumber(redemptionLimitPerClient),
  };
}

/**
 * #48 GET /Admin/loyalty/rewards
 * → [{ id, name, description, pointsCost, discountAmount, expiryDays, redemptionLimitPerClient,
 *      isActive, redemptionsCount }]
 */
export async function getLoyaltyRewards() {
  const data = await callApi(
    'Get loyalty rewards',
    () => apiClient.get('/Admin/loyalty/rewards'),
    'Failed to load rewards'
  );

  return Array.isArray(data.data) ? data.data : data.data?.items || [];
}

/** #49 PUT /Admin/loyalty/rewards/{id} — same body as create */
export async function updateLoyaltyReward(id, reward) {
  const data = await callApi(
    'Update loyalty reward',
    () => apiClient.put(`/Admin/loyalty/rewards/${id}`, rewardBody(reward)),
    'Failed to update the reward'
  );

  return data.data;
}

/** #50 PATCH /Admin/loyalty/rewards/{id}/status { isActive } → { id, isActive } */
export async function setLoyaltyRewardActive(id, isActive) {
  const data = await callApi(
    'Set loyalty reward status',
    () => apiClient.patch(`/Admin/loyalty/rewards/${id}/status`, { isActive: Boolean(isActive) }),
    'Failed to change the reward status'
  );

  return data.data;
}

/** #51 GET /Admin/loyalty/clients/{clientId}/wallet → { availablePoints, pendingPoints, lifetimeEarned, lifetimeRedeemed } */
export async function getClientWallet(clientId) {
  const data = await callApi(
    'Get client wallet',
    () => apiClient.get(`/Admin/loyalty/clients/${clientId}/wallet`),
    "Failed to load the customer's points"
  );

  return data.data;
}

/**
 * #52 GET /Admin/loyalty/clients/{clientId}/transactions
 * → { items: [{ id, type, amount, balanceAfter, reason, bookingId, status, createdAt, createdBy }], totalCount }
 */
export function getClientPointsTransactions(clientId, { page = 1, pageSize = 10 } = {}) {
  return getList(
    'Get client points transactions',
    `/Admin/loyalty/clients/${clientId}/transactions`,
    { page, pageSize },
    "Failed to load the customer's points history"
  );
}
