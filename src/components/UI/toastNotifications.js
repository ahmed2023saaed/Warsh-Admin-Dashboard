import { createElement } from "react";
import toast from "react-hot-toast";
import { ActionToast } from "./ActionToast";

const MAX_VISIBLE_TOASTS = 5;
const activeToastIds = [];
const TOAST_DURATIONS = {
  success: 3500,
  error: 5000,
};

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

function finishToast(toastId, status, message) {
  const duration = TOAST_DURATIONS[status];

  toast.custom(
    (currentToast) => renderActionToast(currentToast, status, message),
    {
      id: toastId,
      duration,
    },
  );

  window.setTimeout(() => {
    untrackToast(toastId);
  }, duration + 1000);

  return toastId;
}

export function showLoadingToast(message = "Please wait...") {
  const toastId = toast.custom(
    (currentToast) => renderActionToast(currentToast, "loading", message),
    { duration: Infinity },
  );

  trackToast(toastId);
  return toastId;
}

function showToastSequence({ status, loadingMessage, message }) {
  const toastId = showLoadingToast(loadingMessage);

  window.setTimeout(() => {
    finishToast(toastId, status, message);
  }, 550);

  return toastId;
}

export function showSuccessToast(
  message,
  loadingMessageOrOptions = "Saving your changes...",
) {
  if (loadingMessageOrOptions?.toastId) {
    return finishToast(loadingMessageOrOptions.toastId, "success", message);
  }

  return showToastSequence({
    status: "success",
    loadingMessage:
      typeof loadingMessageOrOptions === "string"
        ? loadingMessageOrOptions
        : "Saving your changes...",
    message,
  });
}

export function showErrorToast(
  message,
  loadingMessageOrOptions = "Checking what happened...",
) {
  if (loadingMessageOrOptions?.toastId) {
    return finishToast(loadingMessageOrOptions.toastId, "error", message);
  }

  return showToastSequence({
    status: "error",
    loadingMessage:
      typeof loadingMessageOrOptions === "string"
        ? loadingMessageOrOptions
        : "Checking what happened...",
    message,
  });
}

function getToastMessage(message, value) {
  return typeof message === "function" ? message(value) : message;
}

/*
Usage:

try {
  const data = await showPromiseToast(
    async () => {
      const response = await fetch("https://your-api.com/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // fetch only rejects for network errors, so handle HTTP errors manually.
      if (!response.ok) throw new Error("Could not save the item");

      return response.json();
    },
    {
      loading: "Saving item...",
      success: "Item saved successfully.",
      error: (requestError) => requestError.message || "Request failed.",
    },
  );

  console.log(data);
} catch (requestError) {
  console.error(requestError);
}
*/
export async function showPromiseToast(
  promiseOrFactory,
  {
    loading = "Please wait...",
    success = "The request completed successfully.",
    error = "The request failed. Please try again.",
  } = {},
) {
  const toastId = showLoadingToast(loading);

  try {
    const result = await (typeof promiseOrFactory === "function"
      ? promiseOrFactory()
      : promiseOrFactory);

    finishToast(toastId, "success", getToastMessage(success, result));
    return result;
  } catch (requestError) {
    finishToast(toastId, "error", getToastMessage(error, requestError));
    throw requestError;
  }
}
