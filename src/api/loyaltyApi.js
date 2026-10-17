import apiClient from './apiClient';

function getErrorMessage(error, fallbackMessage) {
  if (error.response) {
    return error.response.data?.message || error.response.data?.title || fallbackMessage;
  }

  if (error.request) {
    return 'Unable to reach the server. Please check your connection.';
  }

  return error.message || fallbackMessage;
}

/**
 * Create a reward customers can redeem with their points.
 *
 * rewardData: { name, description, pointsCost, discountAmount, expiryDays, redemptionLimitPerClient }
 */
export async function createLoyaltyReward(rewardData) {
  try {
    const response = await apiClient.post('/Admin/loyalty/rewards', rewardData);

    const data = response.data;

    if (data?.isSuccess === false) {
      throw new Error(data.message || 'Failed to create reward');
    }

    return data;
  } catch (error) {
    console.error('Create reward failed:', error);

    throw new Error(getErrorMessage(error, 'Failed to create reward'), { cause: error });
  }
}

/**
 * Add or deduct points from a client's wallet.
 * Use a positive amount to add points and a negative amount to deduct them.
 */
export async function adjustClientPoints(clientId, { amount, reason }) {
  try {
    const response = await apiClient.post(`/Admin/loyalty/clients/${clientId}/adjust`, {
      clientId,
      amount,
      reason,
    });

    const data = response.data;

    if (data?.isSuccess === false) {
      throw new Error(data.message || 'Failed to adjust points');
    }

    return data;
  } catch (error) {
    console.error('Adjust points failed:', error);

    throw new Error(getErrorMessage(error, 'Failed to adjust points'), { cause: error });
  }
}
