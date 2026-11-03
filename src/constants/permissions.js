// Permission ids from GET /Admin/permissions
export const PERMISSIONS = {
  WORKSHOPS_VIEW: 1,
  WORKSHOPS_MANAGE: 2,
  WORKSHOPS_VERIFY: 3,
  WORKSHOPS_UNVERIFY: 4,
  BOOKINGS_VIEW: 5,
  BOOKINGS_MANAGE: 6,
  CLIENTS_VIEW: 7,
  CLIENTS_MANAGE: 8,
  REVIEWS_VIEW: 9,
  REVIEWS_MANAGE: 10,
  ANALYTICS_VIEW: 11,
  ADMINS_MANAGE: 12,
};

// For responses that list permission codes instead of ids
export const PERMISSION_IDS_BY_CODE = {
  'Permissions.Workshops.View': PERMISSIONS.WORKSHOPS_VIEW,
  'Permissions.Workshops.Manage': PERMISSIONS.WORKSHOPS_MANAGE,
  // The backend currently gives Verify and UnVerify the same code
  'Permissions.Workshops.Verify': PERMISSIONS.WORKSHOPS_VERIFY,
  'Permissions.Bookings.View': PERMISSIONS.BOOKINGS_VIEW,
  'Permissions.Bookings.Manage': PERMISSIONS.BOOKINGS_MANAGE,
  'Permissions.Clients.View': PERMISSIONS.CLIENTS_VIEW,
  'Permissions.Clients.Manage': PERMISSIONS.CLIENTS_MANAGE,
  'Permissions.Reviews.View': PERMISSIONS.REVIEWS_VIEW,
  'Permissions.Reviews.Manage': PERMISSIONS.REVIEWS_MANAGE,
  'Permissions.Analytics.View': PERMISSIONS.ANALYTICS_VIEW,
  'Permissions.Admins.Manage': PERMISSIONS.ADMINS_MANAGE,
};

// Which permissions open each page (keys match NavItem keys). Any one of them is enough.
export const PAGE_PERMISSIONS = {
  dashboard: [PERMISSIONS.ANALYTICS_VIEW],
  customers: [PERMISSIONS.CLIENTS_VIEW, PERMISSIONS.CLIENTS_MANAGE],
  serviceCenters: [
    PERMISSIONS.WORKSHOPS_VIEW,
    PERMISSIONS.WORKSHOPS_MANAGE,
    PERMISSIONS.WORKSHOPS_VERIFY,
    PERMISSIONS.WORKSHOPS_UNVERIFY,
  ],
  bookings: [PERMISSIONS.BOOKINGS_VIEW, PERMISSIONS.BOOKINGS_MANAGE],
  reviews: [PERMISSIONS.REVIEWS_VIEW, PERMISSIONS.REVIEWS_MANAGE],
  adminUsers: [PERMISSIONS.ADMINS_MANAGE],

  // The backend has no permission for these pages yet, so only admins can open them
  payments: [PERMISSIONS.ADMINS_MANAGE],
  marketing: [PERMISSIONS.ADMINS_MANAGE],
  loyalty: [PERMISSIONS.ADMINS_MANAGE],
  settings: [PERMISSIONS.ADMINS_MANAGE],
};
