import { useState } from "react";
import Modal from "../components/UI/Modal";
import { BannerForm } from "./BannerForm";
import { emptyBanner } from "./bannerConstants";

export function EditBannerModal({ open, banner, onClose, onEdit }) {
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
