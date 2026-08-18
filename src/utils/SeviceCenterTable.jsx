import Button from "../components/UI/Button";

export function SeviceCenterTable({ onApprove, onReject }) {
  return [
    {
      key: "Center",
      header: "Center",
      cellClassName: "!text-left",
      render: (center) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#F3EBDD] text-xs font-bold text-[#B96A22]">
            {center.initials}
          </span>
          <span className="whitespace-nowrap text-sm font-medium text-[#1C1712]">
            {center.name}
          </span>
        </div>
      ),
    },
    {
      key: "Brand",
      header: "Brand",
      cellClassName: "!text-left",
      render: (center) => <p className="whitespace-nowrap">{center.brand}</p>,
    },
    {
      key: "Owner",
      header: "Owner",
      cellClassName: "!text-left",
      render: (center) => <p className="whitespace-nowrap">{center.owner}</p>,
    },
    {
      key: "Location",
      header: "Location",
      cellClassName: "!text-left",
      render: (center) => (
        <p className="whitespace-nowrap">{center.location}</p>
      ),
    },
    {
      key: "Submitted",
      header: "Submitted",
      cellClassName: "!text-left",
      render: (center) => (
        <p className="whitespace-nowrap">{center.submitted}</p>
      ),
    },
    {
      key: "Action",
      header: "",
      cellClassName: "!text-left",
      render: (center) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onApprove(center.id)}
            className="!rounded-[10px] !border-[#20A45B] !bg-[#20A45B] !px-4 !py-2 !text-xs !text-white hover:!border-[#19894A] hover:!bg-[#19894A]"
          >
            Approve
          </Button>
          <Button
            onClick={() => onReject(center.id)}
            className="!rounded-[10px] !border-[#F0CCCC] !bg-white !px-4 !py-2 !text-xs !text-[#D64545] hover:!border-[#D64545] hover:!bg-[#FFF7F7]"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];
}

export function CenterBox({ center, onView, onEdit }) {
  const { name, brand, rating, initials, location, bookings, revenue, status } =
    center;

  const statusClassName =
    status === "Active"
      ? "text-[#169447]"
      : status === "Expiring"
        ? "text-[#C97900]"
        : "text-[#D64545]";

  return (
    <article className="flex min-h-[225px] flex-col rounded-[18px] border border-[#E4DDD3] bg-white p-4 shadow-[0_1px_2px_rgba(28,23,18,0.02)] sm:p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#E88B22] text-sm font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-[#17120E]">
            {name}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-sm text-[#8B7868]">
            <span>{brand}</span>
            <span aria-hidden="true">·</span>
            <span>★ {rating}</span>
            <span aria-hidden="true">·</span>
            <span>{location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#8B7868]">
            Bookings
          </p>
          <span className="mt-0.5 block text-base font-bold text-[#17120E]">
            {bookings}
          </span>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#8B7868]">
            Revenue
          </p>
          <span className="mt-0.5 block text-base font-bold text-[#17120E]">
            {revenue.toLocaleString("en-US")}
          </span>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#8B7868]">
            Owes
          </p>
          <span
            className={`mt-0.5 block text-base font-bold ${statusClassName}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <Button
          onClick={() => onView(center)}
          aria-label={`View ${name}`}
          className="!h-[34px] !w-full !rounded-[10px] !border-[#17120E] !bg-[#17120E] !py-0 !text-xs !text-white hover:!border-[#302923] hover:!bg-[#302923]"
        >
          View
        </Button>
        <Button
          onClick={() => onEdit(center)}
          aria-label={`Edit ${name}`}
          className="!h-[34px] !w-full !rounded-[10px] !border-[#E4DDD3] !bg-white !py-0 !text-xs !text-[#17120E] hover:!border-[#CFC4B7] hover:!bg-[#FFFCF8]"
        >
          Edit
        </Button>
      </div>
    </article>
  );
}
