import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import FilterButton from "../components/UI/FilterButton";
import { createBookingColumns, FilterBookings } from "../utils/BookingHelpers";
import MockBookings from "../Data/bookingsMock.json";
import DataTable from "../components/UI/DataTable";
import DetailsDrawer from "../components/UI/DetailsDrawer";
import StatusBadge from "../components/widgets/statusBadge";
import { showSuccessToast } from "../components/UI/toastNotifications";

function CancellationForm({ booking, setSelectedBooking }) {
  const [reason, setReason] = useState("");
  const [cancelledBy, setCancelledBy] = useState("customer");
  const [refundRecipient, setRefundRecipient] = useState("customer");
  const [refundAmount, setRefundAmount] = useState(String(booking.fee));

  function handleRefundRecipientChange({ event }) {
    const recipient = event.target.value;
    setRefundRecipient(recipient);
    setRefundAmount(recipient === "customer" ? String(booking.fee) : "");
  }
  function handleSubmit(event) {
    event.preventDefault();

    booking.status = "cancelled";
    showSuccessToast("Booking is cancelled");
    setSelectedBooking(null);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4">
      <div>
        <label
          htmlFor="cancellation-reason"
          className="text-sm font-semibold text-[#1C1712]"
        >
          Reason for cancellation
        </label>
        <textarea
          id="cancellation-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Enter the reason for cancelling this booking"
          rows={4}
          className="mt-2 w-full resize-none rounded-[10px] border border-[#E8E2D8] bg-white px-3 py-2.5 text-sm text-[#1C1712] outline-none transition focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
          required
        />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-[#1C1712]">
          Who cancelled the booking?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {["customer", "serviceCenter"].map((party) => (
            <label
              key={party}
              className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#E8E2D8] px-3 py-2.5 text-sm text-[#1C1712] transition has-[:checked]:border-[#0E5C5B] has-[:checked]:bg-teal-50"
            >
              <input
                type="radio"
                name="cancelled-by"
                value={party}
                checked={cancelledBy === party}
                onChange={(event) => setCancelledBy(event.target.value)}
                className="h-4 w-4 accent-[#0E5C5B]"
              />
              {party === "customer" ? "Customer" : "Service center"}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-[#1C1712]">
          Who should receive the refund?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {["customer", "serviceCenter"].map((party) => (
            <label
              key={party}
              className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#E8E2D8] px-3 py-2.5 text-sm text-[#1C1712] transition has-[:checked]:border-[#0E5C5B] has-[:checked]:bg-teal-50"
            >
              <input
                type="radio"
                name="refund-recipient"
                value={party}
                checked={refundRecipient === party}
                onChange={handleRefundRecipientChange}
                className="h-4 w-4 accent-[#0E5C5B]"
              />
              {party === "customer" ? "Customer" : "Service center"}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="refund-amount"
          className="text-sm font-semibold text-[#1C1712]"
        >
          Refund amount (EGP)
        </label>
        <input
          id="refund-amount"
          type="number"
          min="0"
          step="0.01"
          value={refundAmount}
          onChange={(event) => setRefundAmount(event.target.value)}
          placeholder="Enter refund amount"
          className="mt-2 w-full rounded-[10px] border border-[#E8E2D8] bg-white px-3 py-2.5 text-sm text-[#1C1712] outline-none transition focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
        />
      </div>

      <Button
        type="submit"
        className="w-full !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !text-white hover:!bg-[#332920]"
        onClick={() => {
          handleSubmit();
        }}
      >
        Cancel Booking
      </Button>
    </form>
  );
}

function Bookings() {
  const [isActive, setIsActive] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings] = useState(MockBookings["bookings"]);
  const currentPage = 1;

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

  const coutn = [10, 2560, 10, 520, 1];
  const filteres = ["all", "pending", "active", "completed", "cancelled"];

  function handelClick(name) {
    setIsActive(name);
  }

  function BookingDetails({ booking }) {
    const canCancel =
      booking.status !== "completed" && booking.status !== "cancelled";
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-base font-bold text-[#1C1712]">
            Booking information
          </h3>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Detail label="Booking ID" value={booking.id} />
            <Detail label="Customer" value={booking.customer.name} />
            <Detail label="Service Center" value={booking.center} />
            <Detail label="Car" value={booking.car} />
            <Detail label="Service" value={booking.service} />
            <Detail label="Payment" value={booking.paymentMethod} />
            <div>
              <p className="text-xs font-semibold uppercase text-[#8A8074]">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-base font-bold text-[#1C1712]">
            Payment summary
          </h3>

          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Detail
              label="Price"
              value={`${booking.price.toLocaleString("en-EG")} EGP`}
            />
            <Detail
              label="Fees"
              value={`${booking.fee.toLocaleString("en-EG")} EGP`}
            />
            <Detail
              label="Commission"
              value={`${booking.commission.toLocaleString("en-EG")} EGP`}
            />
          </div>
        </section>
        {canCancel && (
          <section>
            <h3 className="text-base font-bold text-[#1C1712]">
              Cancel Booking
            </h3>
            <CancellationForm
              key={booking.id}
              booking={booking}
              setSelectedBooking={setSelectedBooking}
            />
          </section>
        )}
      </div>
    );
  }

  function Detail({ label, value }) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase text-[#8A8074]">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-[#1C1712]">
          {value || "Not available"}
        </p>
      </div>
    );
  }

  return (
    <section className="flex min-w-0 flex-col space-y-5 sm:space-y-8">
      <div className="mb-1 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2.5">
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
        <Button className="min-h-[42px] w-full min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-2 !text-base !font-bold !text-white hover:!bg-[#332920] sm:w-auto">
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
      <DetailsDrawer
        open={selectedBooking !== null}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking?.id}
        subtitle={selectedBooking?.customer.name}
      >
        {selectedBooking && <BookingDetails booking={selectedBooking} />}
      </DetailsDrawer>
    </section>
  );
}

export default Bookings;
