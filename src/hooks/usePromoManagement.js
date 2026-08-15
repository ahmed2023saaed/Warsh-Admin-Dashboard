import { useCallback, useMemo, useState } from "react";
import MarkitingTable from "../utils/MarkitingTable";
import { showSuccessToast } from "../components/UI/toastNotifications";

const emptyPromo = {
  id: "",
  code: "",
  discountValue: "",
  discountLabel: "",
  usageLimit: "",
  startingDate: "",
  expiresAt: "",
  status: "Active",
};

function createEmptyPromo() {
  const currentDate = new Date();
  const startingDate = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-");

  return { ...emptyPromo, startingDate };
}

export default function usePromoManagement(initialPromos) {
  const [promoTable, setPromoTable] = useState(initialPromos);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [promoForm, setPromoForm] = useState(createEmptyPromo);

  const requestPromoDelete = useCallback((promo) => {
    setPromoToDelete(promo);
  }, []);

  const promoColumns = useMemo(
    () => MarkitingTable({ onDelete: requestPromoDelete }),
    [requestPromoDelete],
  );

  function openPromoModal() {
    setPromoForm(createEmptyPromo());
    setIsPromoModalOpen(true);
  }

  function closePromoModal() {
    setIsPromoModalOpen(false);
  }

  function cancelPromoDelete() {
    setPromoToDelete(null);
  }

  function confirmPromoDelete() {
    if (!promoToDelete) return;

    setPromoTable((currentPromos) =>
      currentPromos.filter((promo) => promo.id !== promoToDelete.id),
    );
    cancelPromoDelete();

    showSuccessToast("Promo code Has been deleted");
  }

  function handlePromoChange(event) {
    const { name, value } = event.target;
    setPromoForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleSubmitPromoForm(event) {
    event.preventDefault();

    const newPromo = {
      ...promoForm,
      discountValue: Number(promoForm.discountValue),
      usageLimit: Number(promoForm.usageLimit),
      used: 0,
      status: "Active",
    };

    setPromoTable((currentPromos) => [newPromo, ...currentPromos]);
    setPromoForm(createEmptyPromo());
    closePromoModal();

    showSuccessToast("new Promo code has been add");
  }

  return {
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
  };
}
