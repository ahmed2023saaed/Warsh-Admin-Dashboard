/**
 * Shared helpers for the upcoming API files (endpoints that aren't live yet).
 * They follow the "Conventions" sheet of API_ENDPOINTS.xlsx:
 *   - envelope { isSuccess, message, data }
 *   - list params page, pageSize, search, status
 *   - list data { items, page, pageSize, totalCount, totalPages, counts? }
 */
import apiClient from '../apiClient';
import { callApi, toApiError } from '../apiRequest';

/** { page, pageSize, search, status, ...rest } → query params, dropping empty values. */
export function listParams({ page = 1, pageSize = 10, ...filters } = {}) {
  const params = { page, pageSize };

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      params[key] = value;
    }
  }

  return params;
}

/**
 * Any list answer → { items, page, pageSize, totalCount, totalPages, counts }.
 * Accepts data: [...] as well as data: { items, ... } in case the backend sends a plain array.
 */
export function readList(data, mapItem = (item) => item) {
  const rows = Array.isArray(data) ? data : data?.items || [];
  const items = rows.map(mapItem);

  return {
    items,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? items.length,
    totalCount: data?.totalCount ?? items.length,
    totalPages: data?.totalPages ?? 1,
    counts: data?.counts ?? {},
  };
}

/** GET a list endpoint and return readList(...) of its data. */
export async function getList(label, path, query, fallback, mapItem) {
  const data = await callApi(
    label,
    () => apiClient.get(path, { params: listParams(query) }),
    fallback
  );

  return readList(data.data, mapItem);
}

/** Plain object → FormData for multipart endpoints (skips undefined / null values). */
export function toFormData(values) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    formData.append(key, value instanceof Date ? value.toISOString() : value);
  }

  return formData;
}

/** Multipart request config: let the browser set the boundary. */
export const multipart = { headers: { 'Content-Type': undefined } };

/**
 * Downloads a file endpoint (Export buttons) and saves it in the browser.
 * The file name comes from Content-Disposition when the backend sends one.
 */
export async function downloadFile(label, path, params, fallbackName, fallbackMessage) {
  try {
    const response = await apiClient.get(path, { params, responseType: 'blob' });

    const disposition = response.headers?.['content-disposition'] || '';
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    const fileName = match ? decodeURIComponent(match[1]) : fallbackName;

    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    return fileName;
  } catch (error) {
    console.error(`${label} failed:`, error);
    throw toApiError(error, fallbackMessage);
  }
}
