import { createElement } from "react";
import toast from "react-hot-toast";
import { ActionToast } from "./ActionToast";

const MAX_VISIBLE_TOASTS = 5;
const activeToastIds = [];

function untrackToast(toastId) {
  const toastIndex = activeToastIds.indexOf(toastId);
  if (toastIndex !== -1) activeToastIds.splice(toastIndex, 1);
}

function dismissTrackedToast(toastId) {
  untrackToast(toastId);
  toast.dismiss(toastId);
}

function trackToast(toastId) {
  while (activeToastIds.length >= MAX_VISIBLE_TOASTS) {
    const oldestToastId = activeToastIds.shift();
    toast.remove(oldestToastId);
  }

  activeToastIds.push(toastId);
}

function renderActionToast(currentToast, status, message) {
  return createElement(ActionToast, {
    status,
    message,
    visible: currentToast.visible,
    onDismiss: () => dismissTrackedToast(currentToast.id),
  });
}

function showToastSequence({ status, loadingMessage, message }) {
  const finalDuration = status === "error" ? 5000 : 3500;
  const toastId = toast.custom(
    (currentToast) =>
      renderActionToast(currentToast, "loading", loadingMessage),
    { duration: Infinity },
  );
  trackToast(toastId);

  window.setTimeout(() => {
    toast.custom(
      (currentToast) => renderActionToast(currentToast, status, message),
      {
        id: toastId,
        duration: finalDuration,
      },
    );
  }, 550);

  window.setTimeout(() => {
    untrackToast(toastId);
  }, 550 + finalDuration + 1000);

  return toastId;
}

export function showSuccessToast(
  message,
  loadingMessage = "Saving your changes...",
) {
  return showToastSequence({
    status: "success",
    loadingMessage,
    message,
  });
}

export function showErrorToast(
  message,
  loadingMessage = "Checking what happened...",
) {
  return showToastSequence({
    status: "error",
    loadingMessage,
    message,
  });
}
