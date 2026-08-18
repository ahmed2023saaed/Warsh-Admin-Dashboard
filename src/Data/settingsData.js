// data/settingsData.js

export const pricingSettings = [
  {
    id: 'bookingFee',
    title: 'Booking fee',
    description: 'Charged to customer per booking',
    value: '15 EGP',
  },
  {
    id: 'commission',
    title: 'Commission %',
    description: 'Of completed invoice value',
    value: '10%',
  },
  {
    id: 'monthlySubscription',
    title: 'Monthly subscription',
    description: 'After 3-month free period',
    value: '3,000 EGP',
  },
  {
    id: 'marketingPackage',
    title: 'Marketing package',
    description: 'Optional add-on',
    value: '3,000 EGP',
  },
  {
    id: 'freeTrial',
    title: 'Free trial length',
    description: 'First 5 centers per brand',
    value: '3 months',
  },
];

export const catalogSettings = [
  {
    id: 'serviceCategories',
    title: 'Service categories',
    description: 'Oil change, brakes, AC, etc.',
    count: 12,
  },
  {
    id: 'carBrands',
    title: 'Car brands',
    description: 'BMW, Hyundai, Toyota...',
    count: 24,
  },
  {
    id: 'carModels',
    title: 'Car models',
    description: 'Per-brand model list',
    count: 310,
  },
  {
    id: 'oilBrands',
    title: 'Oil brands',
    description: 'Mobil 1, Castrol, Shell...',
    count: 9,
  },
  {
    id: 'servicePrices',
    title: 'Service base prices',
    description: 'Fair Price Guide ranges',
  },
];

export const adminRoles = [
  {
    id: 'superAdmin',
    title: 'Super Admin',
    description: 'Full access to everything',
    users: 1,
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Payments, commission, reports',
    users: 2,
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Banners, promos, campaigns',
    users: 1,
  },
  {
    id: 'customerSupport',
    title: 'Customer Support',
    description: 'Customers, reviews, bookings',
    users: 3,
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Service centers, emergency',
    users: 2,
  },
];