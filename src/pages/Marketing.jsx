import Button from "../components/UI/Button";
import marketingMock from "../Data/marketingMock.json";
import Input from "../components/UI/Input";
import Toggle from "../components/UI/Toggle";
import Modal from "../components/UI/Modal";
import DataTable from "../components/UI/DataTable";
import usePromoManagement from "../hooks/usePromoManagement";

import { showSuccessToast } from "../components/UI/toastNotifications";

import { useState } from "react";
import { Search, Pencil, Trash2, TriangleAlert } from "lucide-react";

import { Banner } from "../utils/Banner";
import { AddBannerModal } from "../utils/AddBannerModal";
import { EditBannerModal } from "../utils/EditBannerModal";

function Marketing() {
  const [banners, setBanners] = useState(marketingMock.banners);
  const [serviceCenters, setServiceCenters] = useState(
    marketingMock.featuredServiceCenters,
  );

  const [bannerModal, setBannerModal] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    cancelPromoDelete,
    closePromoModal,
    confirmPromoDelete,
    handlePromoChange,
    handleSubmitPromoForm,
    isPromoModalOpen,
    openPromoModal,
    promoColumns,
    promoForm,
    promoTable,
    promoToDelete,
  } = usePromoManagement(marketingMock.promoCodes);

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(promoTable.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedPromos = promoTable.slice(
    (currentPageSafe - 1) * perPage,
    currentPageSafe * perPage,
  );

  function openAddModal() {
    setSelectedBanner(null);
    setBannerModal("add");
  }

  /**Banner  */
  function openEditModal(banner) {
    setSelectedBanner(banner);
    setIsActionsModalOpen(false);
    setBannerModal("edit");
  }

  function openActionsModal(banner) {
    setSelectedBanner(banner);
    setIsActionsModalOpen(true);
  }

  function closeActionsModal() {
    setIsActionsModalOpen(false);
    setSelectedBanner(null);
  }

  function openDeleteModal() {
    setIsActionsModalOpen(false);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setSelectedBanner(null);
  }

  function handleDeleteBanner() {
    if (!selectedBanner) return;

    setBanners((currentBanners) =>
      currentBanners.filter((banner) => banner.id !== selectedBanner.id),
    );

    showSuccessToast("Banner Has been deleted");
    closeDeleteModal();
  }

  function handleAddBanner(newBanner) {
    setBanners((currentBanners) => [newBanner, ...currentBanners]);

    setBannerModal(null);
    showSuccessToast("New Banner was added");
  }

  function handleEditBanner(updatedBanner) {
    setBanners((currentBanners) =>
      currentBanners.map((banner) =>
        banner.id === updatedBanner.id ? updatedBanner : banner,
      ),
    );
    showSuccessToast("Banner Has been Edited");
    setBannerModal(null);
    setSelectedBanner(null);
  }

  function handleToggleCenter(centerId, checked) {
    setServiceCenters((currentCenters) =>
      currentCenters.map((center) =>
        center.id === centerId ? { ...center, featured: checked } : center,
      ),
    );
  }

  /**Promo */

  function handlePromoSubmit(event) {
    handleSubmitPromoForm(event);
    setCurrentPage(1);
  }

  function renderNewPromoForm({ formData, onChange, onSubmit }) {
    const labelClassName = "block text-sm font-bold text-[#1C1712]";
    const inputClassName =
      "mt-2 h-11 w-full rounded-[10px] border border-[#E8E2D8] bg-white px-3.5 text-sm text-[#1C1712] outline-none transition-colors placeholder:text-[#A0978D] hover:border-[#D8C9B7] focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15";
    return (
      <form id="new-promo-form" className="space-y-5" onSubmit={onSubmit}>
        <div className="rounded-xl border border-[#F0E1CC] bg-[#FFF9F1] px-4 py-3">
          <p className="text-sm font-bold text-[#1C1712]">Promo details</p>
          <p className="mt-1 text-xs leading-5 text-[#7A6F63]">
            Define the offer customers will receive when using this code.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="promo-code" className={labelClassName}>
            Promo code
            <input
              id="promo-code"
              name="code"
              value={formData.code}
              onChange={onChange}
              type="text"
              placeholder="e.g. WARSHA20"
              className={`${inputClassName} uppercase tracking-[0.08em]`}
              required
            />
            <span className="mt-1.5 block text-xs font-normal text-[#8A8074]">
              Use a short, memorable code.
            </span>
          </label>

          <label htmlFor="promo-discount" className={labelClassName}>
            Discount value
            <input
              id="promo-discount"
              name="discountValue"
              value={formData.discountValue}
              onChange={onChange}
              type="number"
              min={1}
              placeholder="e.g. 20"
              className={inputClassName}
              required
            />
          </label>

          <label
            htmlFor="promo-description"
            className={`${labelClassName} sm:col-span-2`}
          >
            Discount description
            <input
              id="promo-description"
              name="discountLabel"
              value={formData.discountLabel}
              onChange={onChange}
              type="text"
              placeholder="e.g. 20% off your next service"
              className={inputClassName}
              required
            />
          </label>
        </div>
        <div className="border-t border-[#EEE8DF] pt-5">
          <p className="mb-4 text-sm font-bold text-[#1C1712]">
            Usage and schedule
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="promo-max-usage" className={labelClassName}>
              Maximum uses
              <input
                id="promo-max-usage"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={onChange}
                type="number"
                min={1}
                placeholder="e.g. 100"
                className={inputClassName}
                required
              />
            </label>

            <label htmlFor="promo-start-date" className={labelClassName}>
              Start date
              <input
                id="promo-start-date"
                name="startingDate"
                value={formData.startingDate}
                onChange={onChange}
                type="date"
                className={inputClassName}
                required
              />
            </label>

            <label
              htmlFor="promo-expiry-date"
              className={`${labelClassName} sm:col-start-2`}
            >
              Expiry date
              <input
                id="promo-expiry-date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={onChange}
                type="date"
                className={inputClassName}
                required
              />
            </label>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active banners */}
      <section className="rounded-[14px] border border-[#E8E2D8] bg-white p-[18px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-[#1C1712]">Active Banners</h2>

          <Button
            onClick={openAddModal}
            className="!border-[#1C1712] !bg-[#1C1712] !text-white hover:!bg-[#332920]"
          >
            + New banner
          </Button>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {banners.map((banner) => (
            <Banner
              key={banner.id}
              banner={banner}
              onOpenActions={openActionsModal}
            />
          ))}
        </div>
      </section>

      {/* Promo codes and featured centers */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Promo codes */}
        <div className="h-[320px] max-h-[320px] overflow-hidden rounded-[14px] border border-[#E8E2D8] bg-white p-[18px]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#1C1712]">Promo codes</h3>

            <Button
              className="!border-[#1C1712] !bg-[#1C1712] !text-white hover:!bg-[#332920]"
              onClick={openPromoModal}
              type="button"
            >
              + New Code
            </Button>
          </div>
          <div className="mx-auto mt-5 h-[90%] w-[95%] overflow-hidden [&>div]:!h-full [&>div]:!w-full [&>div]:!overflow-hidden [&>div]:!rounded-none [&>div]:!border-0 [&_table]:!w-full [&_table]:table-auto [&_table]:border-collapse [&_thead]:!bg-transparent [&_th]:!px-2.5 [&_th]:!pb-3 [&_th]:!pt-0 [&_th]:!text-left [&_th]:!text-[11px] [&_th]:!font-bold [&_th]:!text-[#8A8074] [&_td]:!px-2.5 [&_td]:!py-[13px] [&_td]:!text-left [&_tr:last-child]:!border-b-0">
            <DataTable
              columns={promoColumns}
              data={paginatedPromos}
              emptyMessage="No promo codes found."
            />
          </div>

          <Modal
            open={isPromoModalOpen}
            onClose={closePromoModal}
            title="Add Promo code"
            size="lg"
            footer={
              <>
                {" "}
                <Button onClick={closePromoModal}>Cancel</Button>
                <Button
                  type="submit"
                  form="new-promo-form"
                  className="min-w-[140px] !rounded-[10px] !border-[#E08B2F] !bg-[#E08B2F] !px-5 !py-2.5 !text-sm !text-white shadow-[0_4px_12px_rgba(224,139,47,0.24)] transition-all hover:!-translate-y-0.5 hover:!border-[#C8730A] hover:!bg-[#C8730A] hover:shadow-[0_6px_16px_rgba(200,115,10,0.28)] active:!translate-y-0 active:!scale-[0.98]"
                >
                  Add promo code
                </Button>
              </>
            }
          >
            {renderNewPromoForm({
              formData: promoForm,
              onChange: handlePromoChange,
              onSubmit: handlePromoSubmit,
            })}
          </Modal>

          <Modal
            open={promoToDelete !== null}
            onClose={cancelPromoDelete}
            title="Delete promo code"
            size="sm"
            footer={
              <>
                <Button onClick={cancelPromoDelete}>Cancel</Button>
                <Button
                  className="min-w-[140px] !rounded-[10px] !border-[#D64545] !bg-[#D64545] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#B93632] hover:!bg-[#B93632]"
                  onClick={confirmPromoDelete}
                >
                  Delete Promo Code
                </Button>
              </>
            }
          >
            <p className="text-sm leading-6 text-[#6F665C]">
              Are you sure you want to delete
              {promoToDelete ? ` ${promoToDelete.code}` : " this promo code"}?
            </p>
          </Modal>
        </div>

        {/* Featured service centers */}
        <div className="flex h-[320px] max-h-[320px] flex-col overflow-hidden rounded-[14px] border border-[#E8E2D8] bg-white p-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[#1C1712]">
              Featured service centers
            </h3>

            <Input
              type="search"
              ID="featured-center-search"
              placeholder="Search centers..."
              icon={Search}
              dimensions={{
                width: "220px",
                height: "40px",
              }}
            />
          </div>

          <div className="mt-4 border-t border-[#E8E2D8]" />
          <div className="min-h-0 flex-1 divide-y divide-[#E8E2D8] overflow-y-auto pr-1">
            {serviceCenters.map((sv) => (
              <div
                key={sv.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e08b2f] text-xs font-bold text-white">
                    {sv.initials}
                  </span>
                  <p className="truncate text-sm font-semibold text-[#1C1712]">
                    {sv.name}
                  </p>
                </div>

                <Toggle
                  id={`featured-${sv.id}`}
                  checked={sv.featured}
                  onChange={(checked) => handleToggleCenter(sv.id, checked)}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <AddBannerModal
        open={bannerModal === "add"}
        onClose={() => setBannerModal(null)}
        onAdd={handleAddBanner}
      />
      <EditBannerModal
        key={selectedBanner?.id ?? "empty-banner"}
        open={bannerModal === "edit"}
        banner={selectedBanner}
        onClose={() => {
          setBannerModal(null);
          setSelectedBanner(null);
        }}
        onEdit={handleEditBanner}
      />
      <Modal
        open={isActionsModalOpen}
        onClose={closeActionsModal}
        title="Banner actions"
        size="sm"
      >
        <p className="mb-4 text-sm leading-6 text-[#8A8074]">
          Choose an action for{" "}
          <span className="font-bold text-[#1C1712]">
            {selectedBanner?.title}
          </span>
          .
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => openEditModal(selectedBanner)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#1C1712] transition-colors hover:bg-[#F6F3EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40"
          >
            <Pencil aria-hidden="true" size={18} />
            Edit
          </button>

          <button
            type="button"
            onClick={openDeleteModal}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#D64545] transition-colors hover:bg-[#FFF2F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D64545]/30"
          >
            <Trash2 aria-hidden="true" size={18} />
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete banner"
        size="sm"
        footer={
          <>
            <Button onClick={closeDeleteModal}>Cancel</Button>
            <Button
              onClick={handleDeleteBanner}
              className="!border-[#D64545] !bg-[#D64545] !text-white hover:!bg-[#B93838]"
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF2F2] text-[#D64545]">
            <TriangleAlert aria-hidden="true" size={20} />
          </span>

          <p className="text-sm leading-6 text-[#6F665C]">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#1C1712]">
              {selectedBanner?.title}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Marketing;
