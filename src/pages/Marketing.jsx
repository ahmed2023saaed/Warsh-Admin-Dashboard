import Button from "../components/UI/Button";
import marketingMock from "../Data/marketingMock.json";
import Input from "../components/UI/Input";
import Toggle from "../components/UI/Toggle";
import Modal from "../components/UI/Modal";
import { useState } from "react";
import {
  Search,
  EllipsisVertical,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";

const emptyBanner = {
  title: "",
  description: "",
  placement: "",
  image: null,
  status: "Draft",
  startsAt: "",
  endsAt: "",
};

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

function Banner({ banner, onOpenActions }) {
  const isLive = banner.status === "Live";

  return (
    <article className="relative overflow-hidden rounded-xl border border-[#E8E2D8] bg-white transition-shadow hover:shadow-md">
      {/* Banner image area */}
      <div className="relative flex h-[100px] items-center justify-center bg-gradient-to-br from-[#2A2119] to-[#1C1712]">
        {banner.image ? (
          <img
            src={banner.image}
            alt={banner.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-[#8A8074]">
            Banner image
          </span>
        )}

        <span
          className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            isLive ? "bg-[#E08B2F] text-white" : "bg-[#F0EDEA] text-[#6F665C]"
          }`}
        >
          {banner.status}
        </span>
      </div>

      {/* Banner information */}
      <div className="min-h-[76px] px-3.5 py-3 pr-12">
        <h3 className="text-[15px] font-bold text-[#1C1712]">{banner.title}</h3>

        <p className="mt-1 text-sm leading-5 text-[#8A8074]">
          {banner.description} . {banner.placement}
        </p>
        <Button
          onClick={onOpenActions}
          aria-label={`More options for ${banner.title}`}
          className="!absolute !bottom-2.5 !right-2.5 !min-h-0 !border-0 !bg-transparent !p-1.5 !text-[#8A8074] !shadow-none hover:!bg-[#F0EDEA] hover:!text-[#1C1712]"
        >
          <EllipsisVertical aria-hidden="true" size={19} />
        </Button>
      </div>
    </article>
  );
}

function BannerForm({
  formData,
  onChange,
  onImageChange,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const labelStyles = "mb-1.5 block text-sm font-bold text-[#1C1712]";
  const fieldStyles =
    "w-full rounded-[10px] border border-[#E8E2D8] bg-white px-3.5 py-2.5 text-sm text-[#1C1712] outline-none transition-colors placeholder:text-[#A0978D] focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="banner-title" className={labelStyles}>
          Title
        </label>

        <input
          id="banner-title"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Banner title"
          className={fieldStyles}
          required
        />
      </div>

      <div>
        <label htmlFor="banner-description" className={labelStyles}>
          Description
        </label>

        <textarea
          id="banner-description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Banner description"
          rows={4}
          className={`${fieldStyles} resize-none leading-6`}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="banner-placement" className={labelStyles}>
            Placement
          </label>

          <select
            id="banner-placement"
            name="placement"
            value={formData.placement}
            onChange={onChange}
            className={fieldStyles}
            required
          >
            <option value="">Select placement</option>
            <option value="Home banner">Home banner</option>
            <option value="Featured centers">Featured centers</option>
            <option value="Services page">Services page</option>
          </select>
        </div>

        <div>
          <label htmlFor="banner-status" className={labelStyles}>
            Status
          </label>

          <select
            id="banner-status"
            name="status"
            value={formData.status}
            onChange={onChange}
            className={fieldStyles}
          >
            <option value="Draft">Draft</option>
            <option value="Live">Live</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="banner-start" className={labelStyles}>
            Start date
          </label>

          <input
            id="banner-start"
            type="date"
            name="startsAt"
            value={formData.startsAt}
            onChange={onChange}
            className={fieldStyles}
            required
          />
        </div>

        <div>
          <label htmlFor="banner-end" className={labelStyles}>
            End date
          </label>

          <input
            id="banner-end"
            type="date"
            name="endsAt"
            value={formData.endsAt}
            min={formData.startsAt}
            onChange={onChange}
            className={fieldStyles}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="banner-image" className={labelStyles}>
          Banner image
        </label>

        <input
          id="banner-image"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="block w-full cursor-pointer rounded-[10px] border border-dashed border-[#D8C9B7] bg-[#FDFBF8] p-2 text-sm text-[#8A8074] transition-colors file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#1C1712] file:px-3.5 file:py-2 file:text-xs file:font-bold file:text-white hover:border-[#E08B2F] hover:bg-[#FFF9F1]"
        />
        <p className="mt-1.5 text-xs text-[#8A8074]">
          PNG, JPG, or WEBP. Use a wide image for the best result.
        </p>
      </div>

      <div className="flex justify-end gap-2 border-t border-[#E8E2D8] pt-5">
        <Button type="button" onClick={onCancel} className="min-w-[92px]">
          Cancel
        </Button>

        <Button
          type="submit"
          className="min-w-[120px] !border-[#1C1712] !bg-[#1C1712] !text-white hover:!bg-[#332920]"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function AddBannerModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState(emptyBanner);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setFormData((currentData) => ({
      ...currentData,
      image: URL.createObjectURL(file),
    }));
  }

  function handleClose() {
    setFormData(emptyBanner);
    onClose();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newBanner = {
      ...formData,
      id: `BNR-${Date.now()}`,
      active: formData.status === "Live",
    };

    onAdd(newBanner);
    setFormData(emptyBanner);
  }

  return (
    <Modal open={open} onClose={handleClose} title="New banner" size="lg">
      <BannerForm
        formData={formData}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Add banner"
      />
    </Modal>
  );
}

function EditBannerModal({ open, banner, onClose, onEdit }) {
  const [formData, setFormData] = useState(() => banner ?? emptyBanner);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setFormData((currentData) => ({
      ...currentData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const updatedBanner = {
      ...formData,
      active: formData.status === "Live",
    };

    onEdit(updatedBanner);
  }

  function handleClose() {
    setFormData(emptyBanner);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Edit banner" size="lg">
      <BannerForm
        formData={formData}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Save changes"
      />
    </Modal>
  );
}

export default Marketing;
