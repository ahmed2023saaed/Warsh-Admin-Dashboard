import { useState } from "react";
import Modal from "../components/UI/Modal";
import { BannerForm } from "./BannerForm";
import { emptyBanner } from "./bannerConstants";

export function AddBannerModal({ open, onClose, onAdd }) {
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
