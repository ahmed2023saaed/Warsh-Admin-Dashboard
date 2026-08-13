import Button from "../components/UI/Button";
import marketingMock from "../Data/marketingMock.json";
import Input from "../components/UI/Input";
import Toggle from "../components/UI/Toggle";
import Modal from "../components/UI/Modal";
import DataTable from "../components/UI/DataTable";
import { useState } from "react";
import { Search, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { emptyBanner } from "../utils/bannerConstants";
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

  function openAddModal() {
    setSelectedBanner(null);
    setBannerModal("add");
  }

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

    closeDeleteModal();
  }

  function handleAddBanner(newBanner) {
    setBanners((currentBanners) => [newBanner, ...currentBanners]);

    setBannerModal(null);
  }

  function handleEditBanner(updatedBanner) {
    setBanners((currentBanners) =>
      currentBanners.map((banner) =>
        banner.id === updatedBanner.id ? updatedBanner : banner,
      ),
    );

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
              onOpenActions={() => openActionsModal(banner)}
            />
          ))}
        </div>
      </section>

      {/* Promo codes and featured centers */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Promo codes */}
        <div className="min-h-[220px] rounded-[14px] border border-[#E8E2D8] bg-white p-[18px]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-[#1C1712]">Promo codes</h3>

            <Button className="!border-[#1C1712] !bg-[#1C1712] !text-white hover:!bg-[#332920]">
              + New Code
            </Button>

          </div>  

        </div>

        {/* Featured service centers */}
        <div className="min-h-[220px] rounded-[14px] border border-[#E8E2D8] bg-white p-[18px]">
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
          <div className="divide-y divide-[#E8E2D8]">
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
 