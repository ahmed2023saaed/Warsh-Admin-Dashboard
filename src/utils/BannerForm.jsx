import Button from "../components/UI/Button";

export function BannerForm({
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
