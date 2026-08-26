import serviceCenters from "../Data/serviceCenters.json";
import DataTable from "../components/UI/DataTable";
import { CenterBox, SeviceCenterTable } from "../utils/SeviceCenterTable";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import { CheckCircle2, Search, TriangleAlert } from "lucide-react";
import { showSuccessToast } from "../components/UI/toastNotifications";
import { useCallback, useMemo, useState } from "react";
import Button from "../components/UI/Button";

function ServiceCenters() {
  const [centerIdToReject, setCenterIdToReject] = useState(null);
  const [centerIdToApprove, setCenterIdToApprove] = useState(null);

  const pendingColumns = useMemo(
    () =>
      SeviceCenterTable({
        onReject: setCenterIdToReject,
        onApprove: setCenterIdToApprove,
      }),
    [],
  );

  const currentPage = 1;
  const centerTable = serviceCenters.pendingServiceCenters;

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(centerTable.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedCenters = centerTable.slice(
    (currentPageSafe - 1) * perPage,
    currentPageSafe * perPage,
  );
  const centerToApprove = centerTable.find(
    (center) => center.id === centerIdToApprove,
  );
  const centerToReject = centerTable.find(
    (center) => center.id === centerIdToReject,
  );

  function confirmApproveCenter() {
    if (centerIdToApprove === null) return;

    // Send centerIdToApprove to the backend here.
    showSuccessToast(
      "Service center approved successfully.",
      "Approving service center...",
    );
    setCenterIdToApprove(null);
  }

  function confirmRejectCenter() {
    if (centerIdToReject === null) return;

    // Send centerIdToReject to the backend here.
    showSuccessToast(
      "Service center rejected successfully.",
      "Rejecting service center...",
    );
    setCenterIdToReject(null);
  }

  const handleViewCenter = useCallback((center) => {
    showSuccessToast(`Opening ${center.name}.`, "Loading center details...");
  }, []);

  const handleEditCenter = useCallback((center) => {
    showSuccessToast(`Editing ${center.name}.`, "Preparing center form...");
  }, []);

  const centerCards = useMemo(
    () =>
      serviceCenters.serviceCenters.map((center) => (
        <CenterBox
          key={center.id}
          center={center}
          onView={handleViewCenter}
          onEdit={handleEditCenter}
        />
      )),
    [handleEditCenter, handleViewCenter],
  );

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[14px] border border-[#E4DDD3] bg-white px-3 pb-4 pt-4 shadow-[0_1px_2px_rgba(28,23,18,0.02)] sm:rounded-[18px] sm:px-6 sm:pb-5 sm:pt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#17120E]">Pending approval</h2>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#C96F00] px-2 py-0.5 text-xs font-bold text-white">
            {centerTable.length}
          </span>
        </div>

        <div className="overflow-x-auto [&>div]:!h-auto [&>div]:!overflow-visible [&>div]:!rounded-none [&>div]:!border-0 [&_table]:min-w-[980px] [&_table]:table-fixed [&_th]:!h-[42px] [&_th]:!border-b [&_th]:!border-[#E7DFD5] [&_th]:!bg-white [&_th]:!px-3 [&_th]:!py-0 [&_th]:!text-left [&_th]:!text-[11px] [&_th]:!font-bold [&_th]:!tracking-[0.06em] [&_th]:!text-[#8B7868] [&_td]:!h-[61px] [&_td]:!px-3 [&_td]:!py-0 [&_td]:!text-sm [&_td]:!text-[#17120E] [&_tr]:!border-[#E7DFD5] [&_tr:last-child]:!border-b-0 [&_tr:hover]:!bg-[#FFFCF8]">
          <DataTable
            columns={pendingColumns}
            data={paginatedCenters}
            emptyMessage="No pending service centers."
          />

          <Modal
            open={centerIdToApprove !== null}
            onClose={() => setCenterIdToApprove(null)}
            title="Approve service center"
            size="sm"
            className="border border-[#D7EBDD]"
            contentClassName="!py-5"
            footerClassName="!px-5 !py-4"
            footer={
              <>
                <Button
                  onClick={() => setCenterIdToApprove(null)}
                  className="min-w-24 !px-5 !py-2.5 !text-sm"
                >
                  Cancel
                </Button>

                <Button
                  onClick={confirmApproveCenter}
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
                <p className="text-base font-bold leading-6 text-[#1C1712]">
                  Approve {centerToApprove?.name ?? "this service center"}?
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[#8A8074]">
                  The center will be approved and can begin receiving customer
                  bookings.
                </p>
              </div>
            </div>
          </Modal>

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
                  onClick={confirmRejectCenter}
                  className="min-w-28 !border-[#D64545] !bg-[#D64545] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#B93636] hover:!bg-[#B93636] focus-visible:!ring-[#D64545]/40"
                >
                  Reject Center
                </Button>
              </>
            }
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D64545]">
                <TriangleAlert
                  aria-hidden="true"
                  size={20}
                  strokeWidth={2.25}
                />
              </span>
              <div>
                <p className="text-base font-bold leading-6 text-[#1C1712]">
                  Reject {centerToReject?.name ?? "this service center"}?
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[#8A8074]">
                  The application will be rejected and removed from the pending
                  approval queue.
                </p>
              </div>
            </div>
          </Modal>
        </div>
      </section>
      <section className="overflow-hidden rounded-[14px] border border-[#E4DDD3] bg-white px-3 pb-4 pt-4 shadow-[0_1px_2px_rgba(28,23,18,0.02)] sm:rounded-[18px] sm:px-6 sm:pb-5 sm:pt-5">
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
            dimensions={{ width: "260px", height: "40px" }}
            className="w-full sm:w-[260px]"
          />
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {centerCards}
        </div>
      </section>
    </div>
  );
}

export default ServiceCenters;
