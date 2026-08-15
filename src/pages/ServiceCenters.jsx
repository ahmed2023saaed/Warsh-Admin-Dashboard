import serviceCenters from "../Data/serviceCenters.json";
import DataTable from "../components/UI/DataTable";
import { CenterBox, SeviceCenterTable } from "../utils/SeviceCenterTable";
import Input from "../components/UI/Input";
import { Search } from "lucide-react";
import { showSuccessToast } from "../components/UI/toastNotifications";
import { useCallback, useMemo } from "react";

function ServiceCenters() {
  const pendingColumns = useMemo(() => SeviceCenterTable(), []);
  const currentPage = 1;
  const centerTable = serviceCenters.pendingServiceCenters;

  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(centerTable.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedCenters = centerTable.slice(
    (currentPageSafe - 1) * perPage,
    currentPageSafe * perPage,
  );

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
      <section className="overflow-hidden rounded-[18px] border border-[#E4DDD3] bg-white px-6 pb-5 pt-5 shadow-[0_1px_2px_rgba(28,23,18,0.02)]">
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
        </div>
      </section>
      <section className="overflow-hidden rounded-[18px] border border-[#E4DDD3] bg-white px-6 pb-5 pt-5 shadow-[0_1px_2px_rgba(28,23,18,0.02)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {centerCards}
        </div>
      </section>
    </div>
  );
}

export default ServiceCenters;
