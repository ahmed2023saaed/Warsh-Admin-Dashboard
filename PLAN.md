# Warsha Admin Dashboard — React 21-Day Development Plan

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React |
| Build Tool | Vite |
| Language | JavaScript |
| Routing | React Router |
| Styling | Tailwind CSS |
| Data | Mock data |
| Components | Reusable components |
| API Structure | API-ready structure |
| Design | Responsive design |

---

## Main Responsibilities

### Ahmed
- Project setup and architecture
- Authentication
- Dashboard analytics
- Commissions and payments
- Reports
- Roles and permissions
- Deployment

### Mohamed
- Design system
- Customers
- Service centers
- Bookings
- Emergency requests
- Reviews
- Responsive UI

---

## 21-Day Development Plan

### Day 1 — Project Setup

**Ahmed:**
- Create the React project using Vite
- Install React Router
- Configure Tailwind CSS
- Configure ESLint and Prettier
- Create the main folder structure
- Configure absolute imports

**Mohamed:**
- Define colors and typography
- Define spacing, radius, shadows, and breakpoints
- Prepare the UI style guide
- Review all required dashboard pages

---

### Day 2 — Shared UI Components

**Ahmed:**
- Button
- Badge
- Avatar
- Modal
- Dropdown
- Tooltip

**Mohamed:**
- Input
- Select
- Checkbox
- Textarea
- Form field
- Skeleton
- Empty state
- Error state

---

### Day 3 — Dashboard Layout

**Ahmed:**
- Create `DashboardLayout`
- Build desktop sidebar
- Build top header
- Add breadcrumbs
- Add profile and notifications menus

**Mohamed:**
- Build mobile navigation
- Add responsive sidebar behavior
- Create page header
- Create reusable page container
- Test tablet and mobile layouts

---

### Day 4 — Authentication

**Ahmed:**
- Create mock authentication service
- Create authentication context or store
- Implement login and logout
- Create protected routes
- Store the mock user session
- Create an unauthorized page

**Mohamed:**
- Build the login page
- Build forgot-password page
- Add form validation
- Add loading and error states
- Make authentication pages responsive

---

### Day 5 — Roles and Permissions

**Ahmed:**
- Define admin roles
- Define permission constants
- Create permission-checking utilities
- Create `ProtectedRoute`
- Create `PermissionRoute`

**Mohamed:**
- Create access-denied component
- Add disabled action states
- Hide restricted navigation items
- Test role-based navigation

---

### Day 6 — Dashboard Overview

**Ahmed:**
- Create mock data for:
  - Monthly revenue
  - Cars serviced today
  - Outstanding commissions
  - Expired subscriptions
  - Average rating
  - Emergency requests
  - New customers
  - New service centers

**Mohamed:**
- KPI cards
- Dashboard grid
- Alerts section
- Recent activity list
- Responsive card layout

---

### Day 7 — Dashboard Charts

**Ahmed:**
- Add revenue chart
- Add daily bookings chart
- Create dashboard service
- Create dashboard hooks
- Add date filtering

**Mohamed:**
- Style chart containers
- Add legends and labels
- Add loading skeletons
- Add empty states
- Test charts on small screens

---

### Day 8 — Customer Management

**Ahmed:**
- Create customer mock data
- Create customer service
- Add search
- Add filtering
- Add pagination
- Add suspend and reactivate actions

**Mohamed:**
- Customer table
- Customer filters
- Customer details drawer
- Status badge
- Suspend confirmation modal

---

### Day 9 — Customer Integration

**Ahmed:**
- Connect customer services to the page
- Store filters in URL search parameters
- Add customer statistics
- Add error handling

**Mohamed:**
- Create mobile customer cards
- Improve table responsiveness
- Add loading and empty states
- Test customer actions

---

### Day 10 — Service Center Management

**Ahmed:**
- Create service-center mock data
- Create service-center service
- Add approve action
- Add reject action
- Add suspend action
- Add commission balance data

**Mohamed:**
- Pending centers table
- Active centers table
- Approval modal
- Rejection form
- Suspension modal

---

### Day 11 — Service Center Details

**Ahmed:**
- Add center performance data
- Add subscription status
- Add booking statistics
- Add commission calculations

**Mohamed:**
- Center details page
- Performance cards
- Subscription information
- Services list
- Center activity history

---

### Day 12 — Booking Management

**Ahmed:**
- Create booking mock data
- Create booking service
- Add booking statuses
- Add customer and center filters
- Add date filtering
- Add pagination

**Mohamed:**
- Bookings table
- Booking details drawer
- Booking timeline
- Booking status badge
- Cancellation modal

---

### Day 13 — Emergency Requests

**Ahmed:**
- Create emergency-request service
- Add request statuses
- Add waiting-time calculations
- Add center assignment
- Add priority logic

**Mohamed:**
- Emergency requests table
- Priority badge
- Waiting-time indicator
- Assignment modal
- Resolution form

---

### Day 14 — Services and Categories

**Ahmed:**
- Create services mock service
- Create categories mock service
- Add create, update, and delete actions
- Add activate and deactivate actions

**Mohamed:**
- Services table
- Categories table
- Add service form
- Edit service form
- Add category form

---

### Day 15 — Reviews and Complaints

**Ahmed:**
- Create reviews service
- Create complaints service
- Add moderation actions
- Add complaint status workflow
- Add search and filters

**Mohamed:**
- Reviews table
- Complaints table
- Review details drawer
- Complaint resolution form
- Moderation actions

---

### Day 16 — Commissions and Payments

**Ahmed:**
- Create commission calculations
- Add fixed booking-fee calculations
- Create payment mock data
- Add outstanding balance logic
- Add payment-status actions

**Mohamed:**
- Commission summary cards
- Commission table
- Payment history table
- Payment details drawer
- Mark-as-paid modal

---

### Day 17 — Subscriptions and Marketing Packages

**Ahmed:**
- Create subscription service
- Add free-trial logic
- Add expiry calculations
- Create marketing-package service
- Add package assignment

**Mohamed:**
- Subscription plans page
- Center subscriptions table
- Expired subscription alerts
- Marketing packages page
- Create and edit forms

---

### Day 18 — Reports and Analytics

**Ahmed:**
- Revenue report
- Booking report
- Commission report
- Service-center performance report
- Report filtering
- Export placeholders

**Mohamed:**
- Report cards
- Report tables
- Filter toolbar
- Date-range controls
- Responsive report layouts

---

### Day 19 — Admin Users and Settings

**Ahmed:**
- Create admin-user service
- Add create and edit admin actions
- Add roles and permissions management
- Create settings service

**Mohamed:**
- Admin users table
- Create-admin form
- Edit-role form
- General settings form
- Notification settings form

---

### Day 20 — Testing and Responsive Fixes

**Ahmed:**
- Test authentication
- Test protected routes
- Test permissions
- Test calculations
- Test services
- Improve performance
- Remove console errors

**Mohamed:**
- Test all pages on mobile
- Test tables and forms
- Fix layout and spacing issues
- Improve accessibility
- Verify loading, empty, and error states

---

### Day 21 — Deployment

**Ahmed:**
- Configure environment variables
- Run the production build
- Review bundle size
- Deploy to Vercel or Netlify
- Prepare the README
- Create a release tag

**Mohamed:**
- Perform final visual testing
- Test navigation and forms
- Test tablet and mobile layouts
- Fix final UI issues
- Prepare screenshots

---

### Shared Tasks (Day 21)
- Run final regression testing
- Fix critical bugs
- Review every dashboard page
- Approve the final release

---

## Recommended Folder Structure
src/
├── app/
│ ├── App.jsx
│ ├── router.jsx
│ └── providers.jsx
│
├── pages/
│ ├── auth/
│ │ ├── LoginPage.jsx
│ │ └── ForgotPasswordPage.jsx
│ ├── dashboard/
│ │ └── DashboardPage.jsx
│ ├── customers/
│ │ ├── CustomersPage.jsx
│ │ └── CustomerDetailsPage.jsx
│ ├── service-centers/
│ │ ├── ServiceCentersPage.jsx
│ │ └── ServiceCenterDetailsPage.jsx
│ ├── bookings/
│ │ └── BookingsPage.jsx
│ ├── emergency-requests/
│ │ └── EmergencyRequestsPage.jsx
│ ├── services/
│ │ └── ServicesPage.jsx
│ ├── categories/
│ │ └── CategoriesPage.jsx
│ ├── reviews/
│ │ └── ReviewsPage.jsx
│ ├── complaints/
│ │ └── ComplaintsPage.jsx
│ ├── commissions/
│ │ └── CommissionsPage.jsx
│ ├── payments/
│ │ └── PaymentsPage.jsx
│ ├── subscriptions/
│ │ └── SubscriptionsPage.jsx
│ ├── marketing-packages/
│ │ └── MarketingPackagesPage.jsx
│ ├── reports/
│ │ └── ReportsPage.jsx
│ ├── admins/
│ │ └── AdminsPage.jsx
│ ├── notifications/
│ │ └── NotificationsPage.jsx
│ ├── settings/
│ │ └── SettingsPage.jsx
│ ├── UnauthorizedPage.jsx
│ └── NotFoundPage.jsx
│
├── layouts/
│ ├── AuthLayout.jsx
│ └── DashboardLayout.jsx
│
├── components/
│ ├── ui/
│ ├── layout/
│ ├── tables/
│ ├── charts/
│ ├── forms/
│ └── feedback/
│
├── features/
│ ├── auth/
│ ├── dashboard/
│ ├── customers/
│ ├── service-centers/
│ ├── bookings/
│ ├── emergency-requests/
│ ├── services/
│ ├── categories/
│ ├── reviews/
│ ├── complaints/
│ ├── commissions/
│ ├── payments/
│ ├── subscriptions/
│ ├── marketing-packages/
│ ├── reports/
│ ├── admins/
│ ├── notifications/
│ └── settings/
│
├── routes/
│ ├── ProtectedRoute.jsx
│ ├── PermissionRoute.jsx
│ └── routeConfig.js
│
├── services/
│ ├── apiClient.js
│ └── mockApiClient.js
│
├── hooks/
├── context/
├── store/
├── lib/
├── utils/
├── constants/
├── validations/
├── mocks/
├── styles/
│ └── index.css
└── main.jsx