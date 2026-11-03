/**
 * Reviews page — API_ENDPOINTS.xlsx rows #34–#36 (not live yet).
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { getList } from './helpers';

/**
 * #34 GET /Admin/reviews — rating: 1-5, reported: true
 * → { items: [{ id, client, workshop, rating, comment, createdAt, reported, reply }], totalCount,
 *     counts: { all, reported, byRating: { 1, 2, 3, 4, 5 } } }
 */
export function getReviews({ page = 1, pageSize = 10, rating, reported, search = '' } = {}) {
  return getList(
    'Get reviews',
    '/Admin/reviews',
    { page, pageSize, rating, reported: reported ? true : undefined, search },
    'Failed to load reviews'
  );
}

/** #35 PUT /Admin/reviews/{id}/reply { reply } → { id, reply } (creates or edits the reply) */
export async function replyToReview(id, reply) {
  const data = await callApi(
    'Reply to review',
    () => apiClient.put(`/Admin/reviews/${id}/reply`, { reply: reply.trim() }),
    'Failed to save the reply'
  );

  return data.data;
}

/** #36 DELETE /Admin/reviews/{id} */
export function deleteReview(id) {
  return callApi(
    'Delete review',
    () => apiClient.delete(`/Admin/reviews/${id}`),
    'Failed to delete the review'
  );
}
