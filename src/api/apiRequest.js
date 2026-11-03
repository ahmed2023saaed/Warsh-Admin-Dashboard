/**
 * The one way every API function sends a request and handles the answer.
 *
 *   export async function getClients(params) {
 *     const data = await callApi('Get clients', () => apiClient.get('/Admin/clients', { params }),
 *       'Failed to load customers');
 *     return data.data;
 *   }
 *
 * Every Warsha endpoint answers { isSuccess, message, data }. callApi returns that envelope,
 * or throws an Error whose `message` can be shown to the user as it is. The error also has:
 *   - status: the HTTP status (0 = the server couldn't be reached)
 *   - fieldErrors: per-field messages from a 400, e.g. { email: 'The Email field is required.' }
 *   - payload: the backend's whole answer, for anything special
 *   - cause: the original axios error
 */

const NETWORK_MESSAGE = 'Unable to reach the server. Please check your connection.';

/** A readable message for any failure: the backend's own text, else `fallback`. */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response) {
    return error.response.data?.message || error.response.data?.title || fallback;
  }
  if (error?.request) return NETWORK_MESSAGE;
  return error?.message || fallback;
}

/**
 * Per-field messages from an ASP.NET 400: { errors: { Email: ['...'], AddressAr: ['...'] } }
 * → { email: '...', addressAr: '...' } (form-style names; "Items[0].Price" → "items.0.price").
 */
export function readFieldErrors(payload) {
  const errors = payload?.errors;
  if (!errors || typeof errors !== 'object' || Array.isArray(errors)) return {};

  const fields = {};
  for (const [key, value] of Object.entries(errors)) {
    const message = Array.isArray(value) ? value[0] : value;
    const field = key
      .replace(/^\$\.?/, '')
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .filter(Boolean)
      .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
      .join('.');
    if (field && message) fields[field] = String(message);
  }
  return fields;
}

/** Turns any failure into the Error described at the top of this file. */
export function toApiError(error, fallback, { networkMessage = NETWORK_MESSAGE } = {}) {
  // Already one of ours (e.g. thrown for isSuccess: false): keep it.
  if (error?.isApiError) return error;

  const payload = error?.response?.data;
  const message = error?.response
    ? payload?.message || payload?.title || fallback
    : error?.request
      ? networkMessage
      : error?.message || fallback;

  const apiError = new Error(message, { cause: error });
  apiError.isApiError = true;
  apiError.status = error?.response?.status ?? (error?.request ? 0 : undefined);
  apiError.payload = payload;
  apiError.fieldErrors = readFieldErrors(payload);
  return apiError;
}

/**
 * Sends a request and checks the answer.
 * - label: what this is, for the console ("Get clients")
 * - send: a function that returns the axios request, e.g. () => apiClient.get(...)
 * - fallback: the message when the backend gives none ("Failed to load customers")
 * - options.networkMessage: a different text when the server can't be reached
 */
export async function callApi(label, send, fallback, options) {
  try {
    const response = await send();
    const data = response.data;

    if (data?.isSuccess === false) {
      // A refusal can come with HTTP 200, so the envelope is always checked.
      const refused = new Error(data.message || fallback);
      refused.isApiError = true;
      refused.status = response.status;
      refused.payload = data;
      refused.fieldErrors = readFieldErrors(data);
      throw refused;
    }

    if (import.meta.env.DEV) console.debug(`[API] ${label}`, data);
    return data;
  } catch (error) {
    console.error(`${label} failed:`, error);
    throw toApiError(error, fallback, options);
  }
}

export default callApi;
