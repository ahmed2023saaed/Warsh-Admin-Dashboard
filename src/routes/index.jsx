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
          // Dashboard - permission 1
          {
            index: true,
            element: (
              <PermissionRoute permissionId={1}>{withSuspense(<Dashboard />)}</PermissionRoute>
            ),
          },

          // Customers - permission 2
          {
            path: 'customers',
            element: (
              <PermissionRoute permissionId={2}>{withSuspense(<Customers />)}</PermissionRoute>
            ),
          },

          // Service Centers - permission 3
          {
            path: 'serviceCenters',
            element: (
              <PermissionRoute permissionId={3}>{withSuspense(<ServiceCenters />)}</PermissionRoute>
            ),
          },

          // Bookings - permission 4
          {
            path: 'bookings',
            element: (
              <PermissionRoute permissionId={4}>{withSuspense(<Bookings />)}</PermissionRoute>
            ),
          },

          // Payments - permission 5
          {
            path: 'payments',
            element: (
              <PermissionRoute permissionId={5}>{withSuspense(<Payments />)}</PermissionRoute>
            ),
          },

          // Reviews - permission 6
          {
            path: 'reviews',
            element: (
              <PermissionRoute permissionId={6}>{withSuspense(<Reviews />)}</PermissionRoute>
            ),
          },

          // Marketing - permission 7
          {
            path: 'marketing',
            element: (
              <PermissionRoute permissionId={7}>{withSuspense(<Marketing />)}</PermissionRoute>
            ),
          },

          // Loyalty management. Permission 10 is provisional and must match the backend.
          {
            path: 'loyalty',
            element: (
              <PermissionRoute permissionId={10}>{withSuspense(<Loyalty />)}</PermissionRoute>
            ),
          },

          // Settings - permission 8
          {
            path: 'settings',
            element: (
              <PermissionRoute permissionId={8}>{withSuspense(<Settings />)}</PermissionRoute>
            ),
          },

          // Admin Users - permission 9
          {
            path: 'adminUsers',
            element: (
              <PermissionRoute permissionId={9}>{withSuspense(<AdminUsers />)}</PermissionRoute>
            ),
          },
        ],
      },
    ],
  },
]);
