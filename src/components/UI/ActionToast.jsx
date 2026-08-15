const toastMeta = {
  loading: {
    title: "Please wait",
    iconClassName: "bg-[#FFF4E5] text-[#E08B2F]",
  },
  success: {
    title: "Success",
    iconClassName: "bg-[#EAF8EF] text-[#2F9E5B]",
  },
  error: {
    title: "Something went wrong",
    iconClassName: "bg-[#FDECEC] text-[#D64545]",
  },
};

function ToastIcon({ status }) {
  if (status === "loading") {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (status === "success") {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="m7 12.5 3.1 3.1L17.5 8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m8 8 8 8m0-8-8 8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ActionToast({ status, message, visible, onDismiss }) {
  const meta = toastMeta[status] ?? toastMeta.loading;

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      className={`action-toast flex w-[min(420px,calc(100vw-32px))] items-center gap-3 rounded-xl border border-[#E8E2D8] bg-white px-4 py-3.5 shadow-[0_14px_36px_rgba(28,23,18,0.16)] ${
        visible ? "action-toast--visible" : "action-toast--hidden"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.iconClassName}`}
      >
        <ToastIcon status={status} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#1C1712]">{meta.title}</p>
        <p className="mt-0.5 text-sm leading-5 text-[#6F665C]">{message}</p>
      </div>

      {status !== "loading" && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#8A8074] transition-colors hover:bg-[#F6F3EE] hover:text-[#1C1712] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E08B2F]/40"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="m7 7 10 10m0-10L7 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
