import BarChartCard from "../components/Charts/barChartCard";
import StatCard from "../components/UI/StatCard";
import { dailyBookingsData, revenueData } from "../Data/dashboardChartsData";
import { mockStatCards } from "../Data/statusCardMocks";
import {RecentBookingColumns} from '../constants/recentBookingColumns'
import DataTable from '../components/UI/DataTable'
import MockBookings from '../Data/bookingsMock.json'
import { useState } from "react";
import {Link} from 'react-router-dom'
import {useParams} from 'react-router-dom'



function Dashboard() {

  const [bookings, setBookings] = useState(MockBookings['bookings'])
  const {lang} = useParams()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockStatCards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBg={card.iconBg}
            title={card.title}
            value={card.value}
            unit={card.unit}
            footer={card.footer}
            footerColor={card.footerColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 h-full">
        <BarChartCard
          title="Revenue — Last 12 Months"
          data={revenueData}
          color="#EF9D32"
          unit="EGP"
          valueFormatter={(value) =>
            `${value.toLocaleString('en-EG')} EGP`
          }
        />

        <BarChartCard
          title="Daily Bookings — This Week"
          data={dailyBookingsData}
          color="#4E7FE5"
          valueFormatter={(value) =>
            `${value} bookings`
          }
        />
      </div>

      <div className='flex items-center grid grid-cols-2'>
        <div className="rounded-2xl w-full bg-white border border-gray-200 p-4 space-y-4 ">

        <div className=" flex items-center justify-between ">
          <h2 className=" font-bold text-sm sm:text-bs ">
            Recent Bookings
          </h2>

          <Link className="text-[#EF9D32] text-xs " to={`/${lang}/bookings`}>
            View all →
          </Link>

        </div>


      <DataTable
        columns={RecentBookingColumns}
        data={bookings.slice(0,4)}
        emptyMessage="No bookings found."
        // minWidth="500px"
       />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;