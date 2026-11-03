import apiClient from './apiClient';

// The backend sends errors in two shapes:
// - validation: { errors: { Email: ['The Email field is required.'] } }
// - account creation: { message: 'Employee creation failed', errors: ["Username 'x' is invalid, ..."] }
// Returns the most useful message plus errors per form field: { name, email, password }
function getErrorDetails(responseData) {
  const errors = responseData?.errors;
  const fieldErrors = {};
  const messages = [];

  if (Array.isArray(errors)) {
    for (const error of errors) {
      const text = typeof error === 'string' ? error : error?.description || error?.message;

      if (!text) continue;

      messages.push(text);

      // The backend uses the name as the username, so username errors belong to the name field
      const field = /^user\s?name/i.test(text)
        ? 'name'
        : /^email/i.test(text)
          ? 'email'
          : /^password/i.test(text)
            ? 'password'
            : null;

      if (field && !fieldErrors[field]) fieldErrors[field] = text;
    }
  } else if (errors && typeof errors === 'object') {
    for (const [key, value] of Object.entries(errors)) {
      const text = Array.isArray(value) ? value[0] : String(value);

      messages.push(text);
      fieldErrors[key.toLowerCase()] = text;
    }
  }

  return {
    message: messages.join(' ') || responseData?.message || responseData?.title,
    fieldErrors,
  };
}

function createUserError(responseData) {
  const { message, fieldErrors } = getErrorDetails(responseData);

  const error = new Error(message || 'Failed to create user');
  error.fieldErrors = fieldErrors;

  return error;
}

// accountType 'admin' -> POST /Admin/create-admin, anything else -> POST /Admin/create-employee
// Both take { name, email, password, permissionIds }
export async function createAdminUser(adminData, accountType) {
  const endpoint = accountType === 'admin' ? '/Admin/create-admin' : '/Admin/create-employee';

  let response;

  try {
    response = await apiClient.post(endpoint, adminData);
  } catch (error) {
    console.error('Create user failed:', error);

    if (error.response) {
      throw createUserError(error.response.data);
    }

    if (error.request) {
      throw new Error('Unable to reach the server. Please check your connection.', {
        cause: error,
      });
    }

    throw error;
  }

  if (!response.data.isSuccess) {
    throw createUserError(response.data);
  }

  return response.data;
}
