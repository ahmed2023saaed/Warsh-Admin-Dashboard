import {
  CreditCard,
  Wallet,
  Clock3,
  Check,
  AlertTriangle,
} from 'lucide-react'

export const paymentsStatCards = [
  {
    key: 'todays-income',
    icon: CreditCard,
    iconColor: '#c8790a',
    iconBg: '#fdf1de',
    title: "Today's Income",
    value: '8,400',
    unit: 'EGP',
    footer: '▲ +12% vs yesterday',
    footerColor: 'var(--green)',
  },

  {
    key: 'monthly-income',
    icon: Wallet,
    iconColor: 'var(--green)',
    iconBg: 'var(--green-bg)',
    title: 'Monthly Income',
    value: '186,400',
    unit: 'EGP',
    footer: '▲ +18% vs April',
    footerColor: 'var(--green)',
  },

  {
    key: 'pending-payments',
    icon: Clock3,
    iconColor: '#c8790a',
    iconBg: '#fdf1de',
    title: 'Pending Payments',
    value: '14,200',
    unit: 'EGP',
    footer: '9 invoices',
    footerColor: '#6B7280',
  },

  {
    key: 'paid-commission',
    icon: Check,
    iconColor: '#2f6fed',
    iconBg: '#eaf1fe',
    title: 'Paid Commission',
    value: '162,300',
    unit: 'EGP',
    footer: 'This month',
    footerColor: '#6B7280',
  },

  {
    key: 'outstanding-commission',
    icon: AlertTriangle,
    iconColor: 'var(--red)',
    iconBg: 'var(--red-bg)',
    title: 'Outstanding Commission',
    value: '23,100',
    unit: 'EGP',
    footer: '12 centers',
    footerColor: 'var(--amber)',
  },
]