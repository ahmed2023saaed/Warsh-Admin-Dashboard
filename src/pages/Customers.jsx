import {
  customerFilters,
  createCustomerColumns,
  creatActivityTable,
} from '../utils/CustomerFilters';
import DetailsDrawer from '../components/UI/DetailsDrawer';
import useAppTranslation from '../hooks/useAppTranslation';
import { Search } from 'lucide-react';
import FilterButton from '../components/UI/FilterButton';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import State from '../components/UI/State';
import DataTable from '../components/UI/DataTable';
import { showErrorToast, showSuccessToast } from '../components/UI/toastNotifications';
import Pagination from '../components/UI/Pagination';
import SuspendModal from '../components/UI/SuspendModal';
import {
  activateClient,
  getClientActivity,
  getClientById,
  getClients,
  suspendClient,
} from '../api/clientsApi';
import { usePaginationParams } from '../hooks/usePaginationParams';
import { useUrlParams } from '../hooks/useUrlParams';
import { usePolling } from '../hooks/usePolling';
import { POLLING } from '../constants/polling';

const emptyResult = { items: [], totalCount: 0, counts: {} };

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-EG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function Customers() {
  const { t } = useAppTranslation('customers');
  const [suspendedAcctount, setSuspendedAcctount] = useState(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  /*
   * Everything that decides what the page shows lives in the URL, so a link or a
   * refresh opens the same view: ?tab=active&q=ahmed&page=2&size=20&customer=28
   */
  const [searchParams, updateParams] = useUrlParams();
  const { page, pageSize, setPage, setPageSize, sizeOptions } = usePaginationParams();
  const requestedTab = searchParams.get('tab');
  const isActive = customerFilters.some((item) => item.key === requestedTab) ? requestedTab : 'all';
  const search = searchParams.get('q') ?? '';
  const selectedCustomerId = searchParams.get('customer');

  // Customers come from GET /Admin/clients, one page at a time
  const [result, setResult] = useState(emptyResult);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());

  const customers = result.items;
  const totalCount = result.totalCount || 0;

  // Which request the shown result came from. After a URL change the old result is still
  // on screen until the new one arrives, so the checks below wait for the current one.
  const queryKey = [page, pageSize, debouncedSearch, isActive, reloadKey].join('|');
  const isCurrentResult =
    !isLoading && result.queryKey === queryKey && debouncedSearch === search.trim();

  const listCustomer = selectedCustomerId
    ? (customers.find((item) => String(item.id) === selectedCustomerId) ?? null)
    : null;

  // The open customer from GET /Admin/clients/{id}; the list row shows until it arrives
  const [details, setDetails] = useState({ id: null, data: null, error: '' });
  const [detailsReloadKey, setDetailsReloadKey] = useState(0);
  const loadedDetails = details.id === selectedCustomerId ? details : null;
  const selectedCustomer = loadedDetails?.data
    ? { ...listCustomer, ...loadedDetails.data }
    : listCustomer;

  useEffect(() => {
    if (!selectedCustomerId) return undefined;

    let ignore = false;
    getClientById(selectedCustomerId)
      .then((data) => {
        if (!ignore) setDetails({ id: selectedCustomerId, data, error: '' });
      })
      .catch((error) => {
        if (!ignore) setDetails({ id: selectedCustomerId, data: null, error: error.message });
      });

    return () => {
      ignore = true;
    };
  }, [selectedCustomerId, detailsReloadKey]);

  // Wait until the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let ignore = false;

    async function loadCustomers() {
      setIsLoading(true);
      setLoadError('');

      try {
        const data = await getClients({
          page,
          pageSize,
          search: debouncedSearch,
          status: isActive,
        });

        if (!ignore) {
          setResult({ ...emptyResult, ...data, items: data?.items || [], queryKey });
        }
      } catch (error) {
        if (!ignore) setLoadError(error.message || 'Failed to load customers');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadCustomers();

    return () => {
      ignore = true;
    };
  }, [page, pageSize, debouncedSearch, isActive, reloadKey, queryKey]);

  // Refresh the list in the background (POLLING.customers, every 15 s) without the loading
  // state. Paused while a drawer or the suspend modal is open, so rows don't move under the
  // user; usePolling also pauses while the tab is hidden, refreshes as soon as it's shown
  // again, and slows down while the server keeps failing.
  const isRefreshPaused = Boolean(selectedCustomerId || suspendedAcctount);

  // An answer for an older search / page must not replace the newer list.
  const currentQueryKey = useRef(queryKey);
  useEffect(() => {
    currentQueryKey.current = queryKey;
  }, [queryKey]);

  usePolling(
    async () => {
      const requestKey = queryKey;
      const data = await getClients({
        page,
        pageSize,
        search: debouncedSearch,
        status: isActive,
      });

      if (requestKey === currentQueryKey.current) {
        setResult({ ...emptyResult, ...data, items: data?.items || [], queryKey: requestKey });
        setLoadError('');
      }
    },
    { ...POLLING.customers, enabled: !isRefreshPaused && !isLoading }
  );

  // ?page=9 when there are only 3 pages: go to the last page instead of an empty table
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(totalCount / pageSize));

    if (isCurrentResult && totalCount > 0 && page > lastPage) setPage(lastPage);
  }, [isCurrentResult, totalCount, page, pageSize, setPage]);

  // A link to a customer that isn't on this page opens from the details endpoint;
  // drop it only when that customer can't be loaded either
  useEffect(() => {
    if (isCurrentResult && selectedCustomerId && !listCustomer && loadedDetails?.error) {
      showErrorToast(loadedDetails.error);
      updateParams({ customer: null });
    }
  }, [isCurrentResult, selectedCustomerId, listCustomer, loadedDetails, updateParams]);

  // Opening a customer adds a history entry, so the browser's Back button closes it
  const openCustomer = useCallback(
    (customer) => updateParams({ customer: customer.id }, { addToHistory: true }),
    [updateParams]
  );
  const closeCustomer = () =>
    updateParams({ customer: null, historyPage: null, historySize: null });

  const requestSuspended = useCallback(
    (customerId) => {
      const customer = customers.find((item) => item.id === customerId);

      setSuspendedAcctount(customer ?? null);
    },
    [customers]
  );

  const customerColumns = useMemo(
    () =>
      createCustomerColumns({
        onView: openCustomer,
        onSuspend: requestSuspended,
      }),
    [openCustomer, requestSuspended]
  );

  function cancelPromoDelete() {
    if (isChangingStatus) return;
    setSuspendedAcctount(null);
  }

  // POST /Admin/clients/{id}/suspend or /activate, then reload so the row, the tab counts
  // and the open drawer show what the backend saved
  async function changeAccountStatus(send, successMessage) {
    if (!suspendedAcctount || isChangingStatus) return;

    setIsChangingStatus(true);
    try {
      await send(suspendedAcctount.id);
      showSuccessToast(successMessage);
      setSuspendedAcctount(null);
      setReloadKey((count) => count + 1);
      setDetailsReloadKey((count) => count + 1);
    } catch (error) {
      // The modal stays open so the admin can retry
      showErrorToast(error.message);
    } finally {
      setIsChangingStatus(false);
    }
  }

  function confirmSuspendedAccount(reason, durationDays = 1) {
    changeAccountStatus(
      (id) => suspendClient(id, { reason: reason.trim(), durationDays }),
      `${suspendedAcctount.fullName} suspended for ${durationDays} day(s)`
    );
  }

  function confirmUnSuspendedAccount() {
    changeAccountStatus(activateClient, `${suspendedAcctount.fullName} is now active`);
  }

  /*********** */
  const activityColumns = useMemo(() => creatActivityTable(), []);

  // Tab badges come from `counts` in the response: { all, active, suspended, new }
  const FilterCount = result.counts || {};

  /****** View Customer ******* */
  // The drawer's history table has its own page in the URL: ?historyPage=2&historySize=10
  const history = usePaginationParams('history');

  // GET /Admin/clients/{id}/activity, one page at a time
  const [activity, setActivity] = useState({ key: null, items: [], totalCount: 0, error: '' });
  const activityKey = [selectedCustomerId, history.page, history.pageSize, detailsReloadKey].join(
    '|'
  );
  const isActivityLoading = Boolean(selectedCustomerId) && activity.key !== activityKey;

  useEffect(() => {
    if (!selectedCustomerId) return undefined;

    let ignore = false;
    getClientActivity(selectedCustomerId, { page: history.page, pageSize: history.pageSize })
      .then(({ items, totalCount }) => {
        if (!ignore) setActivity({ key: activityKey, items, totalCount, error: '' });
      })
      .catch((error) => {
        if (!ignore) {
          setActivity({ key: activityKey, items: [], totalCount: 0, error: error.message });
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCustomerId, history.page, history.pageSize, activityKey]);

  /** */
  function CustomerDetails({ customer }) {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-base font-bold text-[#1C1712]">Customer information</h3>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Detail label="Email" value={customer.email} />
            <Detail label="Phone" value={customer.phone} />
            <State good={customer.status === 'active'} bad={customer.status === 'suspended'}>
              {customer.status}
            </State>

            <Detail label="Joined" value={formatDate(customer.createdAt)} />
          </div>
        </section>

        <section>
          <h3 className="text-base font-bold text-[#1C1712]">Activity</h3>

          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Detail label="Cars" value={String(customer.carsCount ?? 0)} />
            <Detail label="Bookings" value={String(customer.bookingsCount ?? 0)} />
            <Detail label="Total spending" value={formatMoney(customer.totalSpending)} />
          </div>
        </section>

        {/* The list endpoint doesn't return cars or history yet */}
        {customer.cars?.length > 0 && (
          <section>
            <h3 className="text-base font-bold text-[#1C1712]">Registered cars</h3>

            <div className="mt-3 space-y-3">
              {customer.cars.map((car) => (
                <div key={car.id} className="rounded-xl border border-[#E8E2D8] p-4">
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
        )}

        <section>
          <div>
            <h3 className="mb-4 text-base font-bold text-[#1C1712]">Customer History</h3>
          </div>

          {activity.error && !isActivityLoading && (
            <p className="mb-3 text-sm text-[#B03A3A]">
              Couldn't load the history: {activity.error}
            </p>
          )}

          <DataTable
            columns={activityColumns}
            data={isActivityLoading ? [] : activity.items}
            emptyMessage={isActivityLoading ? 'Loading history...' : 'No activity yet.'}
            cellClassName="text-sm"
          />

          {activity.totalCount > 0 && (
            <Pagination
              currentPage={history.page}
              totalItems={activity.totalCount}
              pageSize={history.pageSize}
              onPageChange={history.setPage}
              pageSizeOptions={history.sizeOptions}
              onPageSizeChange={history.setPageSize}
              disabled={isActivityLoading}
            />
          )}
        </section>
      </div>
    );
  }

  function Detail({ label, value }) {
    return (
      <div>
        <p className="text-xs font-semibold text-[#8A8074] uppercase">{label}</p>

        <p className="mt-1 text-sm font-medium text-[#1C1712]">{value || 'Not available'}</p>
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
              onClick={() =>
                updateParams({ tab: item.key === 'all' ? null : item.key }, { resetPage: true })
              }
              key={item.key}
            >
              {t(item.key)}
            </FilterButton>
          ))}
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="search"
            className="h-[42px] w-full rounded-xl border border-gray-300 bg-white py-2 pr-3 pl-8 md:w-[260px]"
            placeholder={t('placeholder')}
            value={search}
            onChange={(e) => updateParams({ q: e.target.value }, { resetPage: true })}
          />
        </div>
      </div>

      {loadError && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#F3C9C9] bg-[#FFF5F5] px-4 py-3">
          <p className="text-sm text-[#B03A3A]">Couldn't load customers: {loadError}</p>

          <button
            type="button"
            onClick={() => setReloadKey((count) => count + 1)}
            className="shrink-0 cursor-pointer text-sm font-bold text-[#B03A3A] underline"
          >
            Retry
          </button>
        </div>
      )}

      <div
        aria-busy={isLoading}
        className={`transition-opacity ${isLoading && customers.length > 0 ? 'opacity-60' : ''}`}
      >
        <DataTable
          columns={customerColumns}
          data={customers}
          emptyMessage={isLoading ? 'Loading customers...' : 'No customers found.'}
          minWidth="800px"
        />
      </div>

      {totalCount > 0 && (
        <Pagination
          currentPage={page}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
          pageSizeOptions={sizeOptions}
          onPageSizeChange={setPageSize}
          disabled={isLoading}
        />
      )}

      <SuspendModal
        open={suspendedAcctount !== null}
        onClose={cancelPromoDelete}
        isSuspended={suspendedAcctount?.status === 'suspended'}
        itemName={suspendedAcctount ? suspendedAcctount.fullName : 'this customer'}
        showDurationOptions={true}
        durationLabel="Choose how long this customer should be suspended."
        onConfirm={(payload) => {
          if (suspendedAcctount?.status === 'suspended') {
            confirmUnSuspendedAccount();
            return;
          }

          if (
            !payload?.reason ||
            !Number.isInteger(payload?.durationDays) ||
            payload.durationDays < 1
          ) {
            return;
          }

          confirmSuspendedAccount(payload.reason, payload.durationDays);
        }}
        confirmLabel={
          isChangingStatus
            ? 'Saving…'
            : suspendedAcctount?.status === 'suspended'
              ? 'Activate Account'
              : 'Suspend Account'
        }
      >
        <p className="text-sm leading-6 text-[#8A8074]">
          Are you sure you want to suspend
          {suspendedAcctount ? ` ${suspendedAcctount.id}` : ' this customer'}?
        </p>
      </SuspendModal>
      <DetailsDrawer
        open={selectedCustomer !== null}
        onClose={closeCustomer}
        title={selectedCustomer?.fullName}
        subtitle={`${selectedCustomer?.id} · ${selectedCustomer?.phone}`}
      >
        {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}
      </DetailsDrawer>
    </div>
  );
}

export default Customers;
