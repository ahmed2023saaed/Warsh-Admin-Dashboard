# Upcoming API (endpoints that aren't live yet)

Ready-to-use functions for the **73 admin endpoints** in `API_ENDPOINTS.xlsx` that weren't in
the backend's Swagger on 2026-11-03 (64 "New" + 9 "Planned"). Nothing in the app imports these
files yet, so they can't break the live pages.

Every function:

- uses the same `callApi` helper as the live API files (`../apiRequest.js`), so errors, toasts and
  the 401 → refresh-token → retry flow work the same way;
- has the sheet's row number in its comment (`#23`), and the request/response shape from the sheet;
- cleans form values before sending (trims text, turns `"50"` into `50`, empty → `null`).

Paths and fields follow the sheet's suggestions. If the backend names something differently when
it goes live, change it in the one function here.

## When an endpoint goes live

1. Check it in Swagger (http://warshaa.runasp.net/swagger/v1/swagger.json): same method, path and body?
2. Import the function in the page instead of the mock data, e.g.
   `import { getBookings } from '../api/upcoming/bookingsApi';`
3. When a whole file is live, you can move it up to `src/api/` and fix its imports
   (`'../apiClient'` → `'./apiClient'`, `'./helpers'` → `'./upcoming/helpers'`).

## Dashboard (ready to switch now)

`useDashboardData.js` loads all six dashboard sections in parallel. **Any section whose endpoint
isn't live yet (or fails) keeps its current mock data**, so the Dashboard page can use it today and
each section switches to real data by itself when its endpoint goes live.

In `src/pages/Dashboard.jsx`:

```jsx
import useDashboardData from '../api/upcoming/useDashboardData';

const { statCards, revenue, dailyBookings, recentBookings, pendingApprovals, topCenters } =
  useDashboardData();
```

| Replace (mock)                | With               | Endpoint                                 |
| ----------------------------- | ------------------ | ---------------------------------------- |
| `mockStatCards`               | `statCards`        | #7 `GET /Admin/dashboard/stats`          |
| `revenueData`                 | `revenue`          | #8 `GET /Admin/dashboard/revenue`        |
| `dailyBookingsData`           | `dailyBookings`    | #9 `GET /Admin/dashboard/daily-bookings` |
| `bookings.slice(0, 4)`        | `recentBookings`   | #23 `GET /Admin/bookings?pageSize=4`     |
| `centerTable`                 | `pendingApprovals` | #16 `GET /Admin/workshops/pending`       |
| `allServiceCenters` (first 3) | `topCenters`       | #10 `GET /Admin/dashboard/top-workshops` |

The shapes are the same as the mock data (see `dashboardMappers.js`): the stat cards keep their
icons and colors, footers turn green ▲ / red ▼ from the change values, and `live` tells you which
sections came from the API, e.g. `{ stats: true, revenue: false, ... }`.

## Files

| File                  | Page                                                         | Sheet rows            |
| --------------------- | ------------------------------------------------------------ | --------------------- |
| `authApi.js`          | Logout, Topbar admin name / role                             | #3–#4                 |
| `dashboardApi.js`     | Dashboard stats and charts                                   | #7–#10                |
| `dashboardMappers.js` | API answers → Dashboard.jsx shapes                           | —                     |
| `useDashboardData.js` | The whole Dashboard, with mock fallback                      | #7–#10, #16, #23      |
| `workshopsApi.js`     | Service Centers (+ featured centers)                         | #16, #19–#22, #44–#45 |
| `bookingsApi.js`      | Bookings (list, details, cancel, export)                     | #23–#26               |
| `paymentsApi.js`      | Payments (summary, 5 tabs, export)                           | #27–#33               |
| `reviewsApi.js`       | Reviews (list, reply, delete)                                | #34–#36               |
| `marketingApi.js`     | Banners (multipart) and promo codes                          | #37–#43               |
| `loyaltyApi.js`       | Rewards list / edit / status, wallet, history                | #48–#52               |
| `settingsApi.js`      | Pricing, platform, roles, base prices                        | #53–#57, #74–#75      |
| `catalogApi.js`       | Service categories, car brands / models, oil brands          | #58–#73               |
| `adminUsersApi.js`    | Admin users list, summary, role, permissions, status         | #76–#77, #80–#83      |
| `plannedApi.js`       | Emergency, notifications, reports, subscriptions, complaints | #84–#92               |
| `helpers.js`          | Shared list / multipart / file-download helpers              | —                     |

Export buttons (`exportBookings`, `exportPayments`) download the file straight away, using the
file name from the backend's `Content-Disposition` header when it sends one.

## Still waiting on the backend (from the sheet's notes)

- **Admin refresh token:** only `POST /Auth/client/refresh-token` exists. If the backend adds
  `POST /Admin/refresh-token`, change `REFRESH_PATH` at the top of `../apiClient.js`.
- **Reject with a reason (#18):** `unverify-workshop/{id}` takes no body yet.
- **create-admin / create-employee (#78, #79):** don't accept `nationalId`, `phoneNumber`, `role` yet.
- **Promo codes (#42):** the form has no `discountType` field yet; `createPromoCode` sends `percentage` by default.
