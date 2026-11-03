/**
 * Marketing page — API_ENDPOINTS.xlsx rows #37–#43 (not live yet).
 * Featured service centers (#44, #45) are in workshopsApi.js.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';
import { multipart, toFormData } from './helpers';

const asList = (data) => (Array.isArray(data) ? data : data?.items || []);

/** BannerForm values → the API body. placement: home_banner | featured_centers | services_page */
const PLACEMENTS = {
  'Home banner': 'home_banner',
  'Featured centers': 'featured_centers',
  'Services page': 'services_page',
};

function bannerBody({ title, description, placement, status, startsAt, endsAt, image }) {
  return toFormData({
    title,
    description,
    placement: PLACEMENTS[placement] ?? placement,
    status: String(status ?? 'draft').toLowerCase(), // the form uses "Draft" / "Live"
    startsAt,
    endsAt,
    // Only a real file is sent; on edit, no file keeps the old image
    image: image instanceof File ? image : undefined,
  });
}

/** #37 GET /Admin/banners → [{ id, title, description, placement, status, startsAt, endsAt, imageUrl }] */
export async function getBanners() {
  const data = await callApi(
    'Get banners',
    () => apiClient.get('/Admin/banners'),
    'Failed to load banners'
  );

  return asList(data.data);
}

/** #38 POST /Admin/banners (multipart) — takes the BannerForm formData as it is */
export async function createBanner(banner) {
  const data = await callApi(
    'Create banner',
    () => apiClient.post('/Admin/banners', bannerBody(banner), multipart),
    'Failed to create the banner'
  );

  return data.data;
}

/** #39 PUT /Admin/banners/{id} (multipart) — the image is optional */
export async function updateBanner(id, banner) {
  const data = await callApi(
    'Update banner',
    () => apiClient.put(`/Admin/banners/${id}`, bannerBody(banner), multipart),
    'Failed to update the banner'
  );

  return data.data;
}

/** #40 DELETE /Admin/banners/{id} */
export function deleteBanner(id) {
  return callApi(
    'Delete banner',
    () => apiClient.delete(`/Admin/banners/${id}`),
    'Failed to delete the banner'
  );
}

/**
 * #41 GET /Admin/promo-codes
 * → [{ id, code, discountType, discountValue, discountLabel, used, usageLimit, startsAt, expiresAt, status }]
 */
export async function getPromoCodes() {
  const data = await callApi(
    'Get promo codes',
    () => apiClient.get('/Admin/promo-codes'),
    'Failed to load promo codes'
  );

  return asList(data.data);
}

/**
 * #42 POST /Admin/promo-codes
 * { code, discountType: 'fixed' | 'percentage', discountValue, discountLabel, usageLimit, startsAt, expiresAt }
 * Note from the sheet: the form has no discountType field yet.
 */
export async function createPromoCode({
  code,
  discountType = 'percentage',
  discountValue,
  discountLabel,
  usageLimit,
  startsAt,
  expiresAt,
}) {
  const data = await callApi(
    'Create promo code',
    () =>
      apiClient.post('/Admin/promo-codes', {
        code: String(code).trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        discountLabel,
        usageLimit: usageLimit === '' || usageLimit == null ? null : Number(usageLimit),
        startsAt,
        expiresAt,
      }),
    'Failed to create the promo code'
  );

  return data.data;
}

/** #43 DELETE /Admin/promo-codes/{id} */
export function deletePromoCode(id) {
  return callApi(
    'Delete promo code',
    () => apiClient.delete(`/Admin/promo-codes/${id}`),
    'Failed to delete the promo code'
  );
}
