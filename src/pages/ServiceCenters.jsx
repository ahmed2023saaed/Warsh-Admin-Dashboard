import serviceCenters from '../Data/serviceCenters.json';
import DataTable from '../components/UI/DataTable';
import { CenterBox, SeviceCenterTable } from '../utils/SeviceCenterTable';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import DetailsDrawer from '../components/UI/DetailsDrawer';
import State from '../components/UI/State';
import { CheckCircle2, Search, TriangleAlert } from 'lucide-react';
import { showSuccessToast } from '../components/UI/toastNotifications';
import { useCallback, useMemo, useState } from 'react';
import Button from '../components/UI/Button';
import Pagination from '../utils/Pagination';
import SuspendModal from '../components/UI/SuspendModal';

import { verifyWorkshop, unverifyWorkshop } from '../api/serviceCenterApi';
import { toast } from 'react-hot-toast';

function ServiceCenters() {
  const [centerIdToReject, setCenterIdToReject] = useState(null);
  const [centerIdToApprove, setCenterIdToApprove] = useState(null);

  const [centers, setCenters] = useState(() => serviceCenters.serviceCenters);
  const [suspendCenterId, setSuspendCenterId] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // const [View, setView] = useState(false);

  const pendingColumns = useMemo(
    () =>
      SeviceCenterTable({
        onReject: setCenterIdToReject,
        onApprove: setCenterIdToApprove,
      }),
    []
  );

  const centerTable = serviceCenters.pendingServiceCenters;
  const [paginatedCenters, setPaginatedCenters] = useState([]);
  const [paginatedCentersGrid, setPaginatedCentersGrid] = useState([]);

  const centerToApprove = centerTable.find((center) => center.id === centerIdToApprove);

  const centerToReject = centerTable.find((center) => center.id === centerIdToReject);

  const suspendCenter = centers.find((center) => center.id === suspendCenterId);

  function updateCenterStatus(status, suspensionDays = null) {
    if (!suspendCenterId) return;

    setCenters((currentCenters) =>
      currentCenters.map((center) =>
        center.id === suspendCenterId ? { ...center, status, suspensionDays } : center
      )
    );
    setSuspendCenterId(null);
  }

  function confirmSuspendCenter({ reason, durationDays }) {
    if (!Number.isInteger(durationDays) || durationDays < 1) {
      showSuccessToast('Enter a valid number of days.');
      return;
    }

    if (!reason || !reason.trim()) {
      showSuccessToast('Please add a reason for the suspension.');
      return;
    }

    showSuccessToast(`Service center suspended for ${durationDays} day(s).`);
    updateCenterStatus('Suspended', durationDays);
    setSuspendCenterId(null);
  }

  function confirmUnsuspendCenter() {
    showSuccessToast('Service center is active.');
    updateCenterStatus('Active');
  }

  const handleViewCenter = useCallback((center) => {
    setSelectedCenter(center);
  }, []);

  const handleEditCenter = useCallback((center) => {
    setSuspendCenterId(center.id);
  }, []);

  const centerCards = useMemo(
    () =>
      paginatedCentersGrid.map((center) => (
        <CenterBox
          key={center.id}
          center={center}
          onView={handleViewCenter}
          onSuspend={handleEditCenter}
        />
      )),
    [paginatedCentersGrid, handleEditCenter, handleViewCenter]
  );

  function CenterDetails({ center }) {
    return (
      <div className="space-y-6">
        <section>
          <h3 className="text-base font-bold text-[#1C1712]">Center information</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Detail label="Owner" value={center.owner?.name} />
            <Detail label="Phone" value={center.owner?.phone} />
            <Detail label="Email" value={center.owner?.email} />
            <Detail
              label="Location"
              value={[
                center.address?.street,
                center.address?.district,
                center.address?.city,
                center.address?.country,
              ]
                .filter(Boolean)
                .join(', ')}
            />
            <Detail label="Joined" value={center.joinedAt} />
            <Detail label="License" value={center.licenseStatus} />
            <div>
              <p className="text-xs font-semibold text-[#8A8074] uppercase">Status</p>
              <State
                good={center.status === 'Active'}
                bad={['Expired', 'Expiring', 'Suspended'].includes(center.status)}
                className="mt-1"
              >
                {center.status}
              </State>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6F665C]">{center.description}</p>
        </section>

        <section>
          <h3 className="text-base font-bold text-[#1C1712]">Performance</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Detail label="Bookings" value={center.bookings} />
            <Detail label="Revenue" value={`${center.revenue.toLocaleString('en-US')} EGP`} />
            <Detail label="Balance" value={`${center.balance.toLocaleString('en-US')} EGP`} />
            <Detail label="Rating" value={`${center.rating} / 5`} />
          </div>
        </section>

        <section>
          <h3 className="text-base font-bold text-[#1C1712]">Services</h3>
          <div className="mt-3 space-y-3">
            {center.services?.map((service) => (
              <div key={service.id} className="rounded-xl border border-[#E8E2D8] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold text-[#1C1712]">{service.name}</p>
                  <span className="text-sm font-semibold text-[#8A8074]">
                    {service.price.toLocaleString('en-US')} EGP
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#8A8074]">
                  {service.category} · {service.durationMinutes} minutes
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-base font-bold text-[#1C1712]">Documents</h3>
          <div className="mt-3 space-y-3">
            {center.documents?.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D8] p-4"
              >
                <div>
                  <p className="font-bold text-[#1C1712]">{document.name}</p>
                  <p className="mt-1 text-sm text-[#8A8074]">Expires {document.expiresAt}</p>
                </div>
                <span className="text-sm font-semibold text-[#169447]">{document.status}</span>
              </div>
            ))}
          </div>
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

  /*************API**********/
  async function handleVerifyWorkshop(id) {
    try {
      await verifyWorkshop(id);

      toast.success('Workshop accepted successfully');

      // Update your UI here
    } catch (error) {
      toast.error(error.message || 'Failed to accept workshop');
    }
  }

  async function handleUnverifyWorkshop(id) {
    try {
      await unverifyWorkshop(id);

      toast.success('Workshop rejected successfully');

      // Update your UI here
    } catch (error) {
      toast.error(error.message || 'Failed to reject workshop');
    }
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[14px] border border-[#E4DDD3] bg-white px-3 pt-4 pb-4 shadow-[0_1px_2px_rgba(28,23,18,0.02)] sm:rounded-[18px] sm:px-6 sm:pt-5 sm:pb-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#17120E]">Pending approval</h2>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#C96F00] px-2 py-0.5 text-xs font-bold text-white">
            {centerTable.length}
          </span>
        </div>

        <div className="overflow-x-auto [&_table]:min-w-[980px] [&_table]:table-fixed [&_td]:!h-[61px] [&_td]:!px-3 [&_td]:!py-0 [&_td]:!text-sm [&_td]:!text-[#17120E] [&_th]:!h-[42px] [&_th]:!border-b [&_th]:!border-[#E7DFD5] [&_th]:!bg-white [&_th]:!px-3 [&_th]:!py-0 [&_th]:!text-left [&_th]:!text-[11px] [&_th]:!font-bold [&_th]:!tracking-[0.06em] [&_th]:!text-[#8B7868] [&_tr]:!border-[#E7DFD5] [&_tr:hover]:!bg-[#FFFCF8] [&_tr:last-child]:!border-b-0 [&>div]:!h-auto [&>div]:!overflow-visible [&>div]:!rounded-none [&>div]:!border-0">
          <DataTable
            columns={pendingColumns}
            data={paginatedCenters}
            emptyMessage="No pending service centers."
          />
          <div className="mt-4">
            <Pagination data={centerTable} perPage={5} onPaginate={setPaginatedCenters} />
          </div>

          {/* ==================== APPROVE MODAL ==================== */}
          <Modal
            open={centerIdToApprove !== null}
            onClose={() => setCenterIdToApprove(null)}
            title="Approve service center"
            size="sm"
            className="border border-[#D7EBDD]"
            contentClassName="!py-5"
            footerClassNamae="!px-5 !py-4"
            footer={
              <>
                <Button
                  onClick={() => setCenterIdToApprove(null)}
                  className="min-w-24 !px-5 !py-2.5 !text-sm"
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => handleVerifyWorkshop(centerIdToApprove)}
                  className="min-w-28 !border-[#20A45B] !bg-[#20A45B] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#19894A] hover:!bg-[#19894A] focus-visible:!ring-[#20A45B]/40"
                >
                  Approve Center
                </Button>
              </>
            }
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF8EF] text-[#20A45B]">
                <CheckCircle2 aria-hidden="true" size={20} strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-base leading-6 font-bold text-[#1C1712]">
                  Approve {centerToApprove?.name ?? 'this service center'}?
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[#8A8074]">
                  The center will be approved and can begin receiving customer bookings.
                </p>
              </div>
            </div>
          </Modal>

          {/* ==================== REJECT MODAL ==================== */}
          <Modal
            open={centerIdToReject !== null}
            onClose={() => setCenterIdToReject(null)}
            title="Reject service center"
            size="sm"
            className="border border-[#F0D2D2]"
            contentClassName="!py-5"
            footerClassName="!px-5 !py-4"
            footer={
              <>
                <Button
                  onClick={() => setCenterIdToReject(null)}
                  className="min-w-24 !px-5 !py-2.5 !text-sm"
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => handleUnverifyWorkshop(centerIdToReject)}

                  className="min-w-28 !border-[#D64545] !bg-[#D64545] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#B93636] hover:!bg-[#B93636] focus-visible:!ring-[#D64545]/40"
                >
                  Reject Center
                </Button>
              </>
            }
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D64545]">
                <TriangleAlert aria-hidden="true" size={20} strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-base leading-6 font-bold text-[#1C1712]">
                  Reject {centerToReject?.name ?? 'this service center'}?
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[#8A8074]">
                  The application will be rejected and removed from the pending approval queue.
                </p>
              </div>
            </div>
          </Modal>

          {/* ==================== SUSPEND / ACTIVATE MODAL ==================== */}
          <SuspendModal
            open={suspendCenterId !== null}
            onClose={() => setSuspendCenterId(null)}
            isSuspended={suspendCenter?.status === 'Suspended'}
            itemName={suspendCenter ? suspendCenter.name : 'this service center'}
            showDurationOptions={true}
            onConfirm={(payload) => {
              if (suspendCenter?.status === 'Suspended') {
                confirmUnsuspendCenter();
                return;
              }

              confirmSuspendCenter(payload);
            }}
            confirmLabel={
              suspendCenter?.status === 'Suspended' ? 'Activate Center' : 'Suspend Center'
            }
          />
          {/* end suspend modal */}
        </div>
      </section>
      <section className="overflow-hidden rounded-[14px] border border-[#E4DDD3] bg-white px-3 pt-4 pb-4 shadow-[0_1px_2px_rgba(28,23,18,0.02)] sm:rounded-[18px] sm:px-6 sm:pt-5 sm:pb-5">
        <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-bold text-[#17120E]">Service Centers</h2>

          <label htmlFor="service-center-search" className="sr-only">
            Search service centers
          </label>
          <Input
            ID="service-center-search"
            icon={Search}
            type="search"
            placeholder="Search centers..."
            dimensions={{ width: '260px', height: '40px' }}
            className="w-full sm:w-[260px]"
          />
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">{centerCards}</div>
        <div className="mt-4">
          <Pagination data={centers} perPage={6} onPaginate={setPaginatedCentersGrid} />
        </div>
      </section>
      <DetailsDrawer
        open={selectedCenter !== null}
        onClose={() => setSelectedCenter(null)}
        title={selectedCenter?.name}
        subtitle={selectedCenter?.brand}
      >
        {selectedCenter && <CenterDetails center={selectedCenter} />}
      </DetailsDrawer>
    </div>
  );
}

export default ServiceCenters;
