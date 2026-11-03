/**
 * Turns the upcoming dashboard API answers into the exact shapes Dashboard.jsx renders today,
 * so switching from mock data is only a data-source change:
 *   stat cards  → mockStatCards items  { key, icon, iconColor, iconBg, title, value, unit, footer, footerColor }
 *   charts      → [{ label, value }]   (BarChartCard)
 *   top centers → [{ id, name, revenue }]
 *   pending     → [{ id, name, location }]
 *   recent      → bookingsMock items   { id, customer: { name, initials }, center, car, service, price, status }
 */
import { mockStatCards } from '../../Data/statusCardMocks';

const number = (value) => Number(value) || 0;
const formatCount = (value) => number(value).toLocaleString('en-EG');

/** "+18%" / "-4%" with an arrow, green when up, red when down. */
function changeFooter(change, suffix, { percent = true } = {}) {
  if (change === undefined || change === null) return { footer: '', footerColor: 'var(--gray)' };

  const value = number(change);
  const arrow = value >= 0 ? '▲' : '▼';
  const sign = value > 0 ? '+' : '';
  return {
    footer: `${arrow} ${sign}${value}${percent ? '%' : ''} ${suffix}`.trim(),
    footerColor: value >= 0 ? 'var(--green)' : 'var(--red)',
  };
}

/** #7 stats → the 8 stat cards, keeping each card's icon and colors from mockStatCards. */
export function toStatCards(stats = {}) {
  const fromApi = {
    'monthly-revenue': {
      value: formatCount(stats.monthlyRevenue?.amount),
      ...changeFooter(stats.monthlyRevenue?.changePercent, 'vs last month'),
    },
    'cars-serviced-today': {
      value: formatCount(stats.carsServicedToday?.count),
      ...changeFooter(stats.carsServicedToday?.changeVsYesterday, 'vs yesterday', {
        percent: false,
      }),
    },
    'outstanding-commission': {
      value: formatCount(stats.outstandingCommission?.amount),
      footer: `${number(stats.outstandingCommission?.workshopsCount)} centers owe`,
      footerColor: 'var(--gray)',
    },
    'expired-subscriptions': {
      value: formatCount(stats.expiredSubscriptions?.count),
      footer: number(stats.expiredSubscriptions?.count) > 0 ? 'Needs action' : 'All up to date',
      footerColor: number(stats.expiredSubscriptions?.count) > 0 ? 'var(--amber)' : 'var(--gray)',
    },
    'avg-customer-rating': {
      value: number(stats.averageRating?.value).toFixed(1),
      ...changeFooter(stats.averageRating?.changeThisMonth, 'this month', { percent: false }),
    },
    'open-emergency-requests': {
      value: formatCount(stats.openEmergencyRequests?.count),
      footer:
        number(stats.openEmergencyRequests?.longestWaitMinutes) > 0
          ? `Longest wait ${number(stats.openEmergencyRequests.longestWaitMinutes)} min`
          : 'No one waiting',
      footerColor:
        number(stats.openEmergencyRequests?.longestWaitMinutes) >= 8
          ? 'var(--amber)'
          : 'var(--gray)',
    },
    'new-customers': {
      value: formatCount(stats.newCustomers?.count),
      ...changeFooter(stats.newCustomers?.changePercent, 'vs last month'),
    },
    'new-service-centers': {
      value: formatCount(stats.newWorkshops?.count),
      footer: `${number(stats.newWorkshops?.pendingCount)} pending approval`,
      footerColor: 'var(--gray)',
    },
  };

  return mockStatCards.map((card) => ({ ...card, ...fromApi[card.key] }));
}

/** #8 [{ month: "2026-01", amount }] → [{ label: "Jan", value }] */
export function toRevenueChart(rows = []) {
  return rows.map((row) => {
    const date = new Date(`${row.month}-01T00:00:00`);
    const label = Number.isNaN(date.getTime())
      ? String(row.month ?? '')
      : date.toLocaleString('en-US', { month: 'short' });

    return { label, value: number(row.amount ?? row.value) };
  });
}

/** #9 [{ date: "2026-10-11", count }] → [{ label: "Sun", value }] */
export function toDailyBookingsChart(rows = []) {
  return rows.map((row) => {
    const date = new Date(`${row.date}T00:00:00`);
    const label = Number.isNaN(date.getTime())
      ? String(row.date ?? '')
      : date.toLocaleString('en-US', { weekday: 'short' });

    return { label, value: number(row.count ?? row.value) };
  });
}

/** #10 → the Top Service Centers list */
export function toTopCenters(rows = []) {
  return rows.map((row) => ({ id: row.id, name: row.name, revenue: number(row.revenue) }));
}

/** #16 pending workshops → the Pending Approvals list */
export function toPendingApprovals(items = []) {
  return items.map((item) => ({
    ...item,
    id: item.id,
    name: item.name,
    location: item.location ?? item.city ?? '',
  }));
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/** #23 booking list items → the Recent Bookings table (same shape as bookingsMock.json) */
export function toRecentBookings(items = []) {
  return items.map((item) => {
    const customerName = item.client?.name ?? item.clientName ?? '';
    const services = Array.isArray(item.services) ? item.services : [];

    return {
      ...item,
      id: item.id,
      customer: { name: customerName, initials: initials(customerName) },
      center: item.workshop?.name ?? item.workshopName ?? '',
      car: item.car ?? '',
      service: services.map((service) => service?.name ?? service).join(', '),
      price: number(item.price),
      status: String(item.status ?? '').toLowerCase(),
    };
  });
}
