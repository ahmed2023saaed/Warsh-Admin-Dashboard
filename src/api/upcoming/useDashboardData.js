/**
 * Everything the Dashboard page shows, from the API — with the current mock data as a
 * fallback for any section whose endpoint isn't live yet (or fails). So it's safe to switch
 * Dashboard.jsx to this hook before all the endpoints exist:
 *
 *   const { statCards, revenue, dailyBookings, recentBookings, pendingApprovals, topCenters } =
 *     useDashboardData();
 *
 * then replace mockStatCards → statCards, revenueData → revenue, dailyBookingsData →
 * dailyBookings, bookings.slice(0, 4) → recentBookings, centerTable → pendingApprovals,
 * allServiceCenters → topCenters (the shapes are the same, see dashboardMappers.js).
 *
 * `live` says which sections came from the API, e.g. { stats: true, revenue: false, ... }.
 */
import { useEffect, useState } from 'react';
import { mockStatCards } from '../../Data/statusCardMocks';
import { dailyBookingsData, revenueData } from '../../Data/dashboardChartsData';
import MockBookings from '../../Data/bookingsMock.json';
import serviceCenters from '../../Data/serviceCenters.json';
import {
  currentWeekRange,
  getDashboardDailyBookings,
  getDashboardRevenue,
  getDashboardStats,
  getTopWorkshops,
} from './dashboardApi';
import { getBookings } from './bookingsApi';
import { getPendingWorkshops } from './workshopsApi';
import {
  toDailyBookingsChart,
  toPendingApprovals,
  toRecentBookings,
  toRevenueChart,
  toStatCards,
  toTopCenters,
} from './dashboardMappers';

const MOCK = {
  statCards: mockStatCards,
  revenue: revenueData,
  dailyBookings: dailyBookingsData,
  recentBookings: MockBookings.bookings.slice(0, 4),
  pendingApprovals: serviceCenters.pendingServiceCenters,
  topCenters: serviceCenters.serviceCenters.slice(0, 3),
};

// Each section: its request and how to map the answer
const SECTIONS = {
  statCards: { live: 'stats', load: () => getDashboardStats().then(toStatCards) },
  revenue: {
    live: 'revenue',
    load: () => getDashboardRevenue({ months: 12 }).then(toRevenueChart),
  },
  dailyBookings: {
    live: 'dailyBookings',
    load: () => getDashboardDailyBookings(currentWeekRange()).then(toDailyBookingsChart),
  },
  recentBookings: {
    live: 'recentBookings',
    load: () => getBookings({ page: 1, pageSize: 4 }).then((list) => toRecentBookings(list.items)),
  },
  pendingApprovals: {
    live: 'pendingApprovals',
    load: () =>
      getPendingWorkshops({ page: 1, pageSize: 5 }).then((list) => toPendingApprovals(list.items)),
  },
  topCenters: { live: 'topCenters', load: () => getTopWorkshops({ limit: 3 }).then(toTopCenters) },
};

export default function useDashboardData() {
  const [state, setState] = useState({ ...MOCK, live: {}, loading: true });

  useEffect(() => {
    let ignore = false;
    const names = Object.keys(SECTIONS);

    Promise.allSettled(names.map((name) => SECTIONS[name].load())).then((results) => {
      if (ignore) return;

      const next = { ...MOCK, live: {}, loading: false };
      results.forEach((result, index) => {
        const name = names[index];
        if (result.status === 'fulfilled') {
          next[name] = result.value;
          next.live[SECTIONS[name].live] = true;
        } else {
          next.live[SECTIONS[name].live] = false; // not live yet (404) or failed → keep the mock
        }
      });

      setState(next);
    });

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}
