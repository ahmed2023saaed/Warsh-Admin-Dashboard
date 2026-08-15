import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import FilterButton from "../components/UI/FilterButton";
import { createBookingColumns, FilterBookings } from "../utils/BookingHelpers";
import MockBookings from "../Data/bookingsMock.json";
import DataTable from "../components/UI/DataTable";

function Bookings() {
  const [isActive, setIsActive] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState(MockBookings["bookings"]);
  const [currentPage, setCurrentPage] = useState(1);

  const bookingColumns = useMemo(
    () =>
      createBookingColumns({
        onView: setSelectedBooking,
      }),
    [],
  );

  const filteredBookings = useMemo(
    () =>
      FilterBookings(bookings, {
        tab: isActive,
      }),
    [bookings, isActive],
  );

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedBookings = filteredBookings.slice(
    (currentPageSafe - 1) * perPage,
    currentPageSafe * perPage,
  );

  const coutn = [10, 2560, 10, 520];
  const filteres = ["all", "pending", "active", "completed"];

  function handelClick(name) {
    setIsActive(name);
  }

  return (
    <section className="flex flex-col space-y-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-2">
          {filteres.map((filter, i) => (
            <FilterButton
              key={filter}
              active={isActive === filter}
              onClick={() => handelClick(filter)}
              count={
                filter == "all"
                  ? coutn.reduce((acc, cur) => acc + cur, 0)
                  : coutn[i]
              }
            >
              {filter}
            </FilterButton>
          ))}
        </div>
        <Button className="min-h-[42px] min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-2 !text-base !font-bold !text-white hover:!bg-[#332920]">
          <Download size={16} strokeWidth={2.5} />
          Export
        </Button>
      </div>

      <DataTable
        columns={bookingColumns}
        data={paginatedBookings}
        rowKey="id"
        emptyMessage="No bookings found."
        minWidth="800px"
      />
    </section>
  );
}

export default Bookings;
