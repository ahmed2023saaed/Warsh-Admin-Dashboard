import BarChartCard from "../components/Charts/barChartCard";
import StatCard from "../components/UI/StatCard";
import { dailyBookingsData, revenueData } from "../Data/dashboardChartsData";
import { mockStatCards } from "../Data/statusCardMocks";
import { RecentBookingColumns } from '../constants/recentBookingColumns'
import DataTable from '../components/UI/DataTable'
import MockBookings from '../Data/bookingsMock.json'
import { useState } from "react";
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import serviceCenters from "../Data/serviceCenters.json";



function Dashboard() {

  const [bookings, setBookings] = useState(MockBookings['bookings'])
  const { lang } = useParams()
  const centerTable = serviceCenters.pendingServiceCenters;
  const allServiceCenters = serviceCenters.serviceCenters;


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

      <div className='flex grid grid-cols-2 gap-4'>
        <div className="rounded-2xl w-full bg-white border border-gray-200 p-4 overflow-hidden space-y-4 ">

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
            data={bookings.slice(0, 4)}
            emptyMessage="No bookings found."
          // minWidth="500px"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col p-4">
          <div className="">

            <div className="flex items-center w-full justify-between mb-2">
              <h2 className="font-bold text-sm">Pending Approvals</h2>
              <span className="bg-red-400 px-2 rounded-full text-white text-xs">{centerTable.length}</span>
            </div>

            <div className="mb-4">
              {centerTable.map((pending) => (
                <div className="">

                  <hr className="text-gray-300 " />

                  <div className="flex items-center justify-between">

                    <div className="my-2 ">
                      <h2 className="font-bold text-sm ">{pending.name}--{pending.location}</h2>
                      <p className="text-gray-500 text-xs ">Review submission</p>
                    </div>

                    <Link to={`/${lang}/serviceCenters`} className="text-white bg-black rounded-lg py-1 px-3 ">Review</Link>
                  </div>

                </div>


              ))}
            </div>

            <hr className="text-gray-300 " />

            <div className="my-4">
              <div className="flex items-center w-full justify-between mb-2">
                <h2 className="font-bold text-sm">Top Service Centers</h2>
              </div>
            </div>

            <div className="mb-4">
              {allServiceCenters.map((center) => (
                <div className="">

                  <hr className="text-gray-300 " />

                  <div className="flex items-center justify-between my-2">

                      <h2 className="font-bold text-sm ">{center.name}</h2>


                    <h2  className="text-sm font-bold  ">{center.revenue.toLocaleString("en-EG")} EGP</h2>
                  </div>

                </div>


              )).slice(0,3)}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;