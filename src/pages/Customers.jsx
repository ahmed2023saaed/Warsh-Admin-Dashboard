import {
  customerFilters,
  filters,
  createCustomerColumns,
  creatActivityTable,
} from "../utils/CustomerFilters";
import DetailsDrawer from "../components/UI/DetailsDrawer";
import useAppTranslation from "../hooks/useAppTranslation";
import { Search } from "lucide-react";
import FilterButton from "../components/UI/FilterButton";
import { useCallback, useMemo, useState } from "react";
import customerData from "../Data/customers.json";
import State from "../components/UI/State";
import DataTable from "../components/UI/DataTable";
import { showSuccessToast } from "../components/UI/toastNotifications";
import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";

function Customers() {
  const { t } = useAppTranslation("customers");
  const [isActive, setIsActive] = useState("all");
  const [customers] = useState(customerData.customers);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suspendedAcctount, setSuspendedAcctount] = useState(null);

  const requestSuspended = useCallback((customerId) => {
    const customer = customerData.customers.find(
      (item) => item.id === customerId,
    );

    setSuspendedAcctount(customer ?? null);
  }, []);

  const customerColumns = useMemo(
    () =>
      createCustomerColumns({
        onView: setSelectedCustomer,
        onSuspend: requestSuspended,
      }),
    [requestSuspended],
  );

  function cancelPromoDelete() {
    setSuspendedAcctount(null);
  }

  function confirmSuspendedAccount() {
    if (!suspendedAcctount) return;

    suspendedAcctount.status = "suspended";
    cancelPromoDelete();

    showSuccessToast(
      `${suspendedAcctount.fullName + " " + suspendedAcctount.id} SUSPENDED`,
    );
  }

  function confirmUnSuspendedAccount() {
    if (!suspendedAcctount) return;

    suspendedAcctount.status = "active";
    cancelPromoDelete();

    showSuccessToast(
      `${suspendedAcctount.fullName + " " + suspendedAcctount.id} is now ACTIVE`,
    );
  }

  /*********** */
  const activityColumns = useMemo(() => creatActivityTable(), []);

  const FilterCount = {
    all: customers.length,
    // active: customers.filter( customer => customer.status === 'active').length,
    // suspended: customers.filter( customer => customer.status === 'suspended').length,
    ...Object.fromEntries(
      ["active", "suspended", "new"].map((filter) => [
        filter,
        customers.filter((c) => c.status === filter).length,
      ]),
    ),
  };

  const filtered = useMemo(
    () => filters(customers, { search, tap: isActive }),
    [customers, isActive, search],
  );

  const customersCurrentPage = 1;
  const customersperPage = 8;

  const totalPages = Math.max(1, Math.ceil(filtered.length / customersperPage));
  const customerscurrentPageSafe = Math.min(customersCurrentPage, totalPages);
  const customerpaginated = filtered.slice(
    (customerscurrentPageSafe - 1) * customersperPage,
    customerscurrentPageSafe * customersperPage,
  );

  const activtyCurrentPage = 1;
  const activtyperPage = 4;

  const activityTotalPages = Math.max(
    1,
    Math.ceil(filtered.length / activtyperPage),
  );
  const activtycurrentPageSafe = Math.min(
    activtyCurrentPage,
    activityTotalPages,
  );

  const currentCustomerActivities = selectedCustomer?.activity || [];

  const paginated = currentCustomerActivities.slice(
    (activtycurrentPageSafe - 1) * activtyperPage,
    activtycurrentPageSafe * activtyperPage,
  );

  /** */
  function CustomerDetails({ customer }) {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-base font-bold text-[#1C1712]">
            Customer information
          </h3>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Detail label="Email" value={customer.email} />
            <Detail label="Phone" value={customer.phone} />
            <State
              good={customer.status === "active"}
              bad={customer.status === "suspended"}
            >
              {customer.status}
            </State>

            <Detail label="Joined" value={customer.createdAt} />
          </div>
        </section>

        <section>
          <h3 className="text-base font-bold text-[#1C1712]">
            Registered cars
          </h3>

          <div className="mt-3 space-y-3">
            {customer.cars.map((car) => (
              <div
                key={car.id}
                className="rounded-xl border border-[#E8E2D8] p-4"
              >
                <p className="font-bold text-[#1C1712]">
                  {car.brand} {car.model}
                </p>

                <p className="mt-1 text-sm text-[#8A8074]">
                  {car.year} · {car.plateNumber}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div>
            <h3 className="text-base font-bold text-[#1C1712] mb-4">
              Customer History
            </h3>
          </div>
          <DataTable
            columns={activityColumns}
            data={paginated}
            emptyMessage="No Activiyes were found."
            cellClassName="text-sm"
          />
        </section>
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
    <div className="min-w-0 space-y-4">
      {/* Header Buttons */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {customerFilters.map((item) => (
            <FilterButton
              count={FilterCount[item.key]}
              active={isActive === item.key}
              onClick={() => setIsActive(item.key)}
              key={item.key}
            >
              {t(item.key)}
            </FilterButton>
          ))}
        </div>

        <div className="relative w-full md:w-auto">
          <Search
            className=" absolute left-2 text-gray-500 top-1/2 -translate-y-1/2 "
            size={18}
          />
          <input
            type="search"
            className="h-[42px] w-full rounded-xl border border-gray-300 bg-white py-2 pl-8 pr-3 md:w-[260px]"
            placeholder={t("placeholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* columns,
    data,
    emptyMessage,
    minWidth,
    cellClassName */}
      <DataTable
        columns={customerColumns}
        data={customerpaginated}
        emptyMessage="No customers found."
        minWidth="800px"
      />
      <Modal
        open={suspendedAcctount !== null}
        onClose={cancelPromoDelete}
        title={
          suspendedAcctount?.status === "suspended"
            ? "Activate Account"
            : "Suspend Account"
        }
        size="sm"
        footer={
          <>
            <Button onClick={cancelPromoDelete}>Cancel</Button>
            <Button
              className={
                suspendedAcctount?.status === "suspended"
                  ? "min-w-[140px] !rounded-[10px] !border-[#16A34A] !bg-[#16A34A] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#15803D] hover:!bg-[#15803D]"
                  : "min-w-[140px] !rounded-[10px] !border-[#D64545] !bg-[#D64545] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#B93632] hover:!bg-[#B93632]"
              }
              onClick={() => {
                if (suspendedAcctount?.status === "suspended") {
                  confirmUnSuspendedAccount();
                } else {
                  confirmSuspendedAccount();
                }
              }}
            >
              {suspendedAcctount?.status === "suspended"
                ? "Activate Account"
                : "Suspend Account"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-[#6F665C]">
          Are you sure you want to suspend
          {suspendedAcctount ? ` ${suspendedAcctount.id}` : " this customer"}?
        </p>
      </Modal>
      <DetailsDrawer
        open={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.fullName}
        subtitle={`${selectedCustomer?.id} · ${selectedCustomer?.phone}`}
      >
        {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}
      </DetailsDrawer>
    </div>
  );
}

export default Customers;
