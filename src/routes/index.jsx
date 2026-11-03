import { createBrowserRouter, redirect } from 'react-router-dom';
import { Suspense } from 'react';

import {
  Login,
  Register,
  Dashboard,
  Customers,
  ServiceCenters,
  Bookings,
  Payments,
  Reviews,
  Marketing,
  Loyalty,
  Settings,
  AdminUsers,
} from './lazyPages';

import { RouteFallback } from '../components/UI/fallback';
import AuthLayout from '../components/layouts/AuthLayout';
import AppLayout from '../components/layouts/AppLayout';
import ProtectedRoutes from './protectedRoutes';
import PermissionRoute from './PermissionRoute';

const withSuspense = (node) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    loader: () => {
      const accessToken = localStorage.getItem('accessToken');
      const adminUser = localStorage.getItem('adminUser');

      if (accessToken && adminUser) {
        return redirect('/en');
      }

      return redirect('/en/login');
    },
  },

  {
    path: ':lang',
    children: [
      // Login
      {
        path: 'login',
        element: withSuspense(
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },

      // Register
      {
        path: 'register',
        element: withSuspense(
          <AuthLayout>
            <Register />
          </AuthLayout>
        ),
      },

      // Protected pages
      {
        element: (
          <ProtectedRoutes>
            <AppLayout />
          </ProtectedRoutes>
        ),

        children: [
          // Dashboard - View Analytics
          {
            index: true,
            element: (
              <PermissionRoute page="dashboard">{withSuspense(<Dashboard />)}</PermissionRoute>
            ),
          },

          // Customers - View or Manage Clients
          {
            path: 'customers',
            element: (
              <PermissionRoute page="customers">{withSuspense(<Customers />)}</PermissionRoute>
            ),
          },

          // Service Centers - any Workshops permission
          {
            path: 'serviceCenters',
            element: (
              <PermissionRoute page="serviceCenters">
                {withSuspense(<ServiceCenters />)}
              </PermissionRoute>
            ),
          },

          // Bookings - View or Manage Bookings
          {
            path: 'bookings',
            element: (
              <PermissionRoute page="bookings">{withSuspense(<Bookings />)}</PermissionRoute>
            ),
          },

          // Payments - admins only until the backend adds a permission
          {
            path: 'payments',
            element: (
              <PermissionRoute page="payments">{withSuspense(<Payments />)}</PermissionRoute>
            ),
          },

          // Reviews - View or Manage Reviews
          {
            path: 'reviews',
            element: <PermissionRoute page="reviews">{withSuspense(<Reviews />)}</PermissionRoute>,
          },

          // Marketing - admins only until the backend adds a permission
          {
            path: 'marketing',
            element: (
              <PermissionRoute page="marketing">{withSuspense(<Marketing />)}</PermissionRoute>
            ),
          },

          // Loyalty - admins only until the backend adds a permission
          {
            path: 'loyalty',
            element: <PermissionRoute page="loyalty">{withSuspense(<Loyalty />)}</PermissionRoute>,
          },

          // Settings - admins only until the backend adds a permission
          {
            path: 'settings',
            element: (
              <PermissionRoute page="settings">{withSuspense(<Settings />)}</PermissionRoute>
            ),
          },

          // Admin Users - Manage Admins
          {
            path: 'adminUsers',
            element: (
              <PermissionRoute page="adminUsers">{withSuspense(<AdminUsers />)}</PermissionRoute>
            ),
          },
        ],
      },
    ],
  },
]);
