import { lazy } from "react";

export const Dashboard = lazy(() => import("../pages/Dashboard"));
export const AdminUsers = lazy(() => import("../pages/AdminUsers"));
export const Bookings = lazy(() => import("../pages/Bookings"));
export const Customers = lazy(() => import("../pages/Customers"));
export const Marketing = lazy(() => import("../pages/Marketing"));
export const Payments = lazy(() => import("../pages/Payments"));
export const Reviews = lazy(() => import("../pages/Reviews"));
export const ServiceCenters = lazy(() => import("../pages/ServiceCenters"));
export const Settings = lazy(() => import("../pages/Settings"));
export const Login = lazy(() => import("../pages/Auth/login"));
export const Register = lazy(() => import("../pages/Auth/register"));
