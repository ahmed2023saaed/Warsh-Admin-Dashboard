import {createBrowserRouter, redirect} from 'react-router-dom'
// import { Dashboard, Login,  } from './lazyPages'
import {  Login, Register} from './lazyPages'
import { RouteFallback } from '../components/UI/fallback'
import AuthLayout from '../components/layouts/AuthLayout'
import { Suspense } from 'react';
import ProtectedRoutes from './protectedRoutes';
import AppLayout from '../components/layouts/AppLayout';
import { Dashboard, Customers, ServiceCenters, Bookings, Payments, Reviews, Marketing, Settings, AdminUsers } from './lazyPages'



const withSuspense = (node)=> <Suspense fallback={<RouteFallback />}>{node}</Suspense>

export const router = createBrowserRouter([

    {
        path: '/',
        loader: () => redirect('/ar/login')
    },


    {
        path: ':lang',
        children: [
             //       Public routes AuthLayout
            {
                path: 'login',
                element: withSuspense(<AuthLayout><Login /></AuthLayout>),
            },
            {
                path: 'register',
                element: withSuspense(<AuthLayout><Register /></AuthLayout>),
            },


            //       Protected routes AppLayout
            {
                element:(
                    <ProtectedRoutes>
                        <AppLayout />
                    </ProtectedRoutes>
                ),
                children: [
                    {index: true, element: withSuspense(<Dashboard />)},
                    {path: 'customers', element: withSuspense(<Customers />)},
                    {path: 'serviceCenters', element: withSuspense(<ServiceCenters />)},
                    {path: 'bookings', element: withSuspense(<Bookings />)},
                    {path: 'payments', element: withSuspense(<Payments />)},
                    {path: 'reviews', element: withSuspense(<Reviews />)},
                    {path: 'marketing', element: withSuspense(<Marketing />)},
                    {path: 'settings', element: withSuspense(<Settings />)},
                    {path: 'adminUsers', element: withSuspense(<AdminUsers />)}
                ]
            }
        ]
    }
])