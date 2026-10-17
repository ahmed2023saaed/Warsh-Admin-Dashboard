# Warsha Admin Dashboard: Backend Endpoints Needed

This list comes from going through every page, form, and button in the dashboard and noting
what each one needs from the backend. Today most pages run on mock data in `src/Data/`.

**Legend:** ✅ exists in the backend · ⚠️ exists but needs a change · 🆕 needed

## Conventions (apply to every endpoint)

- **Base path:** `/api/v1/Admin/...`. Every endpoint needs the admin `Bearer` token and is
  checked against the admin's permissions.
- **Response envelope:** the same one the backend already uses: `{ isSuccess, message, data }`.
- **Lists:** query `page`, `pageSize`, `search`, `status` (same names as `Client/bookings`).
  `data` = `{ items: [], page, pageSize, totalCount, totalPages }`.
- **Filter-tab counts:** pages show a count on every filter tab, so list endpoints should also
  return `counts` (e.g. `{ all, active, suspended }`) for the current search.
- **IDs:** integers. **Dates:** ISO 8601. **Money:** number in EGP.
- **Statuses:** lowercase strings (`active`, `suspended`, `pending`...). The mocks mix
  `Active` / `active`; this needs to be one format.
- **Errors:** `isSuccess: false` + `message` the dashboard can show in a toast.

---

## 1. Auth & signed-in admin (Login page, Topbar, routes)

| | Method & path | Used for |
|---|---|---|
| ✅ | `POST /Admin/login` | Login form |
| ⚠️ | `POST /Auth/client/refresh-token` | Token refresh (dashboard currently uses the **client** endpoint) |
| 🆕 | `POST /Admin/logout` | Logout button |
| 🆕 | `GET /Admin/me` | Topbar name and role (currently hardcoded "Saif Fawzy / Super Admin") |
| ✅ | `GET /Admin/user-permissions/{id}` | Permissions after login |
| ✅ | `GET /Admin/permissions` | Permission list for Add Employee (not wired yet) |

- **Login** body `{ email, password }` → `{ id, email, accessToken, refreshToken, expiresAt }`.
  Please also return `name` and `role` so the topbar can show them.
- **Refresh:** confirm `/Auth/client/refresh-token` accepts admin refresh tokens, or add
  `POST /Admin/refresh-token` body `{ refreshToken }` → `{ accessToken, refreshToken, expiresAt }`.
- **Logout** body `{ refreshToken }` → revokes it (the client version exists already).
- **Me** → `{ id, name, email, role, permissionIds: [] }`.
- **Permissions** → `[{ id, name, key }]`. The dashboard currently assumes IDs 1-9
  (dashboard, customers, serviceCenters, bookings, payments, reviews, marketing, settings,
  adminUsers) and **10 for loyalty**. The backend needs to confirm or provide these.

> The `/register` page calls a `register()` function that no longer exists in `AuthContext`.
> Admins are created from Admin Users, so this page should probably be removed rather than given an endpoint.

---

## 2. Dashboard

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/dashboard/stats` | The 8 stat cards |
| 🆕 | `GET /Admin/dashboard/revenue?months=12` | "Revenue — Last 12 Months" chart |
| 🆕 | `GET /Admin/dashboard/daily-bookings?from=&to=` | "Daily Bookings — This Week" chart |
| 🆕 | `GET /Admin/dashboard/top-workshops?limit=3` | "Top Service Centers" list |
| — | `GET /Admin/bookings?pageSize=4` | "Recent Bookings" table (see Bookings) |
| — | `GET /Admin/workshops/pending?pageSize=5` | "Pending Approvals" list + badge (see Service Centers) |

**Stats response**
```json
{
  "monthlyRevenue":        { "amount": 186400, "changePercent": 18 },
  "carsServicedToday":     { "count": 42, "changeVsYesterday": 6 },
  "outstandingCommission": { "amount": 23100, "workshopsCount": 12 },
  "expiredSubscriptions":  { "count": 4 },
  "averageRating":         { "value": 4.7, "changeThisMonth": 0.1 },
  "openEmergencyRequests": { "count": 2, "longestWaitMinutes": 8 },
  "newCustomers":          { "count": 312, "changePercent": 24 },
  "newWorkshops":          { "count": 7, "pendingCount": 3 }
}
```
- **Revenue** → `[{ "month": "2026-01", "amount": 148000 }]`
- **Daily bookings** → `[{ "date": "2026-10-11", "count": 14 }]`
- **Top workshops** → `[{ "id", "name", "revenue" }]`

---

## 3. Customers

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/clients` | Customers table, search, filter tabs |
| 🆕 | `GET /Admin/clients/{id}` | "View" drawer: info and cars |
| 🆕 | `GET /Admin/clients/{id}/activity` | "Customer History" table in the drawer |
| 🆕 | `POST /Admin/clients/{id}/suspend` | Suspend modal |
| 🆕 | `POST /Admin/clients/{id}/activate` | Unsuspend |

- **List** query `page, pageSize, search (name/phone), status = active | suspended | new`
  - item `{ id, fullName, phone, email, carsCount, bookingsCount, totalSpending, status, createdAt }`
  - `counts: { all, active, suspended, new }`. "New" means joined this month. It could be a
    separate filter instead of a status.
- **Details** → `{ id, fullName, email, phone, status, createdAt, suspendedUntil, suspensionReason,
  cars: [{ id, brand, model, year, plateNumber }] }`
- **Activity** query `page, pageSize` → item `{ id, type, description, date }`.
  `type` e.g. `booking_completed | review_added | payment_completed`.
- **Suspend** body `{ reason, durationDays }` (the modal offers preset or custom days)
- **Activate** no body.

---

## 4. Service Centers (workshops)

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/workshops/pending` | "Pending approval" table + count badge |
| ✅ | `POST /Admin/verify-workshop/{id}` | Approve button |
| ⚠️ | `POST /Admin/unverify-workshop/{id}` | Reject button |
| 🆕 | `GET /Admin/workshops` | Service-center cards, search |
| 🆕 | `GET /Admin/workshops/{id}` | Details drawer |
| 🆕 | `POST /Admin/workshops/{id}/suspend` | Suspend modal |
| 🆕 | `POST /Admin/workshops/{id}/activate` | Unsuspend |

- **Pending** query `page, pageSize` → item `{ id, name, brands, ownerName, location, submittedAt }`
- **Reject:** should accept body `{ reason }`. Also confirm that "unverify" = reject an application
  (it currently takes no body).
- **List** query `page, pageSize, search, status = active | expiring | expired | suspended`
  → item `{ id, name, brands, rating, location, bookingsCount, revenue, balance, status }`
- **Details** →
  ```text
  { id, name, brands, description, status, joinedAt, licenseStatus,
    owner: { name, phone, email },
    address: { street, district, city, country },
    openingTime, closingTime, supportedBrands: [],
    bookingsCount, revenue, balance, rating,
    services:  [{ id, nameEn, nameAr, category, durationMinutes, minPrice, maxPrice, active }],
    documents: [{ id, name, status, uploadedAt, expiresAt, fileUrl }] }
  ```
- **Suspend** body `{ reason, durationDays }`. Store `suspendedAt` / `suspendedUntil` and
  reactivate automatically after `suspendedUntil`.

---

## 5. Bookings

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/bookings` | Bookings table + status tabs (counts are hardcoded today) |
| 🆕 | `GET /Admin/bookings/{id}` | "View" drawer |
| 🆕 | `POST /Admin/bookings/{id}/cancel` | Cancel form in the drawer |
| 🆕 | `GET /Admin/bookings/export` | "Export" button |

- **List** query `page, pageSize, status = pending | active | completed | cancelled, search,
  workshopId, clientId, from, to` → item
  `{ id, client: { id, name }, workshop: { id, name }, car, services: [], price, fee, commission,
  paymentMethod, status, scheduledAt, createdAt }`, plus
  `counts: { all, pending, active, completed, cancelled }`
- **Cancel** body:
  ```json
  {
    "reason": "Customer could not attend",
    "cancelledBy": "client | workshop",
    "refundToClient": 15,
    "refundToWorkshop": null
  }
  ```
- **Export** query same filters + `format = xlsx | csv` → file download.

---

## 6. Payments

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/payments/summary` | 5 stat cards |
| 🆕 | `GET /Admin/payments/booking-fees` | "Booking Fees" tab |
| 🆕 | `GET /Admin/payments/subscriptions` | "Subscriptions" tab |
| 🆕 | `GET /Admin/payments/marketing` | "Marketing" tab |
| 🆕 | `GET /Admin/payments/commissions` | "Commission" tab |
| 🆕 | `GET /Admin/payments/refunds` | "Refunds" tab |
| 🆕 | `GET /Admin/payments/{tab}/export?format=xlsx\|pdf` | "Excel" / "PDF" buttons |

All lists take `page, pageSize, status, from, to, search`.

- **Summary** → `{ todaysIncome: { amount, changePercent }, monthlyIncome: { amount, changePercent },
  pendingPayments: { amount, invoicesCount }, paidCommission: { amount },
  outstandingCommission: { amount, workshopsCount } }`
- **Booking fees** item `{ id, date, workshopName, clientName, bookingId, bookingFee, paymentMethod, status }`.
  Status: `paid | pending | refunded | failed`.
- **Subscriptions** item `{ id, date, workshopName, amount, paymentMethod, status, renewalDate }`.
  Status: `paid | pending | failed | expired | cancelled`.
- **Marketing** item `{ id, date, workshopName, campaign, amount, paymentMethod, status }`.
  Status: `active | pending | completed | failed | cancelled`.
- **Commissions** item `{ id, date, workshopName, totalPrice, commissionRate, commissionAmount, status }`.
  Status: `paid | pending | overdue`.
- **Refunds** item `{ id, date, workshopName, clientName, originalTransactionType, originalTransactionId,
  refundAmount, paymentMethod, status, reason }`. Status: `completed | processing | pending | rejected`.
- `paymentMethod` values in the UI: `Card, Cash, Fawry, InstaPay, Vodafone Cash, Bank Transfer`.

---

## 7. Reviews

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/reviews` | Review list, star/reported tabs, search, topbar count |
| 🆕 | `PUT /Admin/reviews/{id}/reply` | Reply modal (create or edit the reply) |
| 🆕 | `DELETE /Admin/reviews/{id}` | Delete button |

- **List** query `page, pageSize, rating = 1-5, reported = true, search` → item
  `{ id, client: { id, name }, workshop: { id, name }, rating, comment, createdAt, reported, reply }`,
  plus `counts: { all, reported, byRating: { 1, 2, 3, 4, 5 } }`
- **Reply** body `{ reply }`

---

## 8. Marketing

### Banners
| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/banners` | Banner cards |
| 🆕 | `POST /Admin/banners` | "Add banner" form |
| 🆕 | `PUT /Admin/banners/{id}` | "Edit banner" form |
| 🆕 | `DELETE /Admin/banners/{id}` | Delete banner |

- **Create / Edit** body (`multipart/form-data`, because of the image upload):
  `{ title, description, placement, status, startsAt, endsAt, image (file) }`
  - `placement` = `home_banner | featured_centers | services_page`
  - `status` = `draft | live`
  - `image` optional on edit (keep the old one if not sent)
- **List** item `{ id, title, description, placement, status, startsAt, endsAt, imageUrl }`

### Promo codes
| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/promo-codes` | Promo codes table |
| 🆕 | `POST /Admin/promo-codes` | "New promo code" form |
| 🆕 | `DELETE /Admin/promo-codes/{id}` | Delete promo code |

- **Create** body `{ code, discountType, discountValue, discountLabel, usageLimit, startsAt, expiresAt }`
  - `discountType` = `fixed | percentage`. The form doesn't have this field yet; we'll add it.
- **List** item `{ id, code, discountType, discountValue, discountLabel, used, usageLimit,
  startsAt, expiresAt, status }`. Status: `active | expired | disabled`.

### Featured service centers
| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/workshops/featured?search=` | Featured centers list with toggles |
| 🆕 | `PUT /Admin/workshops/{id}/featured` | Toggle a center on/off |

- **List** item `{ id, name, featured }`
- **Toggle** body `{ featured: true | false }`

---

## 9. Loyalty & Rewards

| | Method & path | Used for |
|---|---|---|
| ✅ | `POST /Admin/loyalty/rewards` | "Create Reward" form |
| ✅ | `POST /Admin/loyalty/clients/{clientId}/adjust` | "Adjust Customer Points" form |
| 🆕 | `GET /Admin/loyalty/rewards` | Show existing rewards (the page can only list what it created this session) |
| 🆕 | `PUT /Admin/loyalty/rewards/{id}` | Edit a reward |
| 🆕 | `PATCH /Admin/loyalty/rewards/{id}/status` | Enable / disable a reward |
| 🆕 | `GET /Admin/loyalty/clients/{clientId}/wallet` | Show a client's balance before adjusting |
| 🆕 | `GET /Admin/loyalty/clients/{clientId}/transactions` | Client points history |

- **Create reward** body `{ name, description, pointsCost, discountAmount, expiryDays, redemptionLimitPerClient }`
- **Adjust** body `{ clientId, amount, reason }`. `amount` is positive to add points and negative to deduct.
- **Rewards list** item `{ id, name, description, pointsCost, discountAmount, expiryDays,
  redemptionLimitPerClient, isActive, redemptionsCount }`
- **Status** body `{ isActive }`
- **Wallet** → `{ availablePoints, pendingPoints, lifetimeEarned, lifetimeRedeemed }`
- **Transactions** query `page, pageSize` → item `{ id, type, amount, balanceAfter, reason,
  bookingId, status, createdAt, createdBy }`

---

## 10. Settings

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/settings/pricing` | "Pricing & Commission" section |
| 🆕 | `PUT /Admin/settings/pricing` | Its Edit → Save |
| 🆕 | `GET /Admin/settings/platform` | "Platform" section |
| 🆕 | `PATCH /Admin/settings/platform` | The toggles |
| 🆕 | `GET /Admin/roles` | "Admin Roles & Permissions" section, role select in Add Employee |
| | **Catalog** ("Manage" buttons; those pages aren't built yet) | |
| 🆕 | `GET / POST / PUT / DELETE /Admin/service-categories` | Service categories |
| ✅ | `GET /CarCatalog/car-brands` · `POST /CarCatalog/brands` | Car brands (list, add) |
| 🆕 | `PUT / DELETE /CarCatalog/brands/{id}` | Car brands (edit, delete) |
| ✅ | `GET /CarCatalog/car-brands/{id}/models` · `POST /CarCatalog/models` | Car models (list, add) |
| 🆕 | `PUT / DELETE /CarCatalog/models/{id}` | Car models (edit, delete) |
| 🆕 | `GET / POST / PUT / DELETE /Admin/oil-brands` | Oil brands |
| 🆕 | `GET / PUT /Admin/service-prices` | Service base prices (Fair Price Guide) |

- **Pricing** `{ bookingFee, commissionPercent, monthlySubscription, marketingPackage, freeTrialMonths }`
- **Platform** `{ appVersion (read-only), maintenanceMode, defaultLanguage, emergencySosEnabled }`
- **Roles** item `{ id, key, name, description, usersCount, permissionIds }`
- **Service category** body `{ nameEn, nameAr, icon }` (only `GET /Workshop/service-categories` exists today)
- **Car brand** body `{ name, icon }` · **Car model** body `{ name, brandId }`
- **Oil brand** body `{ name }`
- **Service prices** `[{ serviceCategoryId, minPrice, maxPrice }]`

---

## 11. Admin Users

| | Method & path | Used for |
|---|---|---|
| 🆕 | `GET /Admin/users` | Users table, search, role and status filters |
| 🆕 | `GET /Admin/users/summary` | 4 stat cards |
| ⚠️ | `POST /Admin/create-admin` · `POST /Admin/create-employee` | "Add Employee" form |
| 🆕 | `GET /Admin/users/{id}` | "View Details" |
| 🆕 | `PUT /Admin/users/{id}/role` | "Change Role" |
| 🆕 | `PUT /Admin/users/{id}/permissions` | "Manage Permissions" |
| 🆕 | `PATCH /Admin/users/{id}/status` | "Deactivate / Activate User" |

- **List** query `page, pageSize, search, role, status = active | inactive` → item
  `{ id, fullName, email, role, status, lastActiveAt, isProtected, createdAt }`
- **Summary** → `{ totalUsers, admins, customRoles, activeUsers }`
- **Create:** today it accepts `{ name, email, password, permissionIds }`, but the form also
  collects **`nationalId` (14 digits), `phoneNumber`, and `role`**, which are currently dropped.
  The backend should accept them.
- **Role** body `{ role }` · **Permissions** body `{ permissionIds: [] }` · **Status** body `{ status }`

---

## 12. Pages planned but not built yet

These are in `PLAN.md` / the topbar titles and will need endpoints when they're built:

- **Emergency requests:** `GET /Admin/emergency-requests`, `POST .../{id}/assign { workshopId }`,
  `POST .../{id}/resolve { notes }` (also feeds the "Open Emergency Requests" dashboard card)
- **Notifications:** `GET /Admin/notifications`, `PATCH /Admin/notifications/{id}/read`
- **Reports:** `GET /Admin/reports/{type}?from=&to=&format=`
- **Subscriptions:** `GET /Admin/subscriptions`, plan management
  (feeds the "Expired Subscriptions" dashboard card)
- **Complaints:** `GET /Admin/complaints`, `PATCH /Admin/complaints/{id}/status`

---

## Summary

| Area | ✅ Exists | ⚠️ Change | 🆕 New |
|---|---|---|---|
| Auth & admin | 3 | 1 | 2 |
| Dashboard | 0 | 0 | 4 |
| Customers | 0 | 0 | 5 |
| Service Centers | 1 | 1 | 5 |
| Bookings | 0 | 0 | 4 |
| Payments | 0 | 0 | 7 |
| Reviews | 0 | 0 | 3 |
| Marketing | 0 | 0 | 9 |
| Loyalty | 2 | 0 | 5 |
| Settings | 4 | 0 | 19 |
| Admin Users | 0 | 2 | 6 |
| **Total** | **10** | **4** | **69** |
