import { Trash } from "lucide-react";
import State from "../components/UI/State";

export default function MarkitingTable({ onDelete }) {
  return [
    {
      key: "Code",
      header: "Code",
      cellClassName: "whitespace-nowrap !text-left",
      render: (promo) => (
        <span
          className="block truncate whitespace-nowrap text-sm font-bold tracking-[-0.01em] text-[#1C1712]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {promo.code}
        </span>
      ),
    },
    {
      key: "Discount",
      header: "Discount",
      cellClassName: "whitespace-nowrap !text-left",
      render: (promo) => (
        <span className="block truncate whitespace-nowrap text-sm font-medium text-[#1C1712]">
          {promo.discountLabel}
        </span>
      ),
    },
    {
      key: "Uses",
      header: "Uses",
      cellClassName: "whitespace-nowrap !text-left",
      render: (promo) => (
        <span className="block truncate whitespace-nowrap text-sm font-medium text-[#1C1712]">
          {promo.used} / {promo.usageLimit}
        </span>
      ),
    },
    {
      key: "Status",
      header: "Status",
      cellClassName: "whitespace-nowrap !text-left",
      render: (promo) => {
        if (promo.status !== "Active") {
          return (
            <State
              bgColor="#F0EDEA"
              fontColor="#8A8074"
              className="!min-h-0 !min-w-0 !px-2.5 !py-[3px] !text-xs !leading-4"
            >
              {promo.status}
            </State>
          );
        }

        return (
          <State
            good
            className="!min-h-0 !min-w-0 !px-2.5 !py-[3px] !text-xs !leading-4"
          >
            {promo.status}
          </State>
        );
      },
    },
    {
      key: "Delete",
      header: "Delete",
      cellClassName: "whitespace-nowrap !text-left",
      render: (promo) => (
        <button
          type="button"
          onClick={() => onDelete(promo)}
          aria-label={`Delete promo {${promo.code}}`}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-transparent text-[#D64545] shadow-none transition-all hover:-translate-y-0.1 hover:bg-transparent hover:text-[#B93632] hover:shadow-none active:translate-y-0 active:scale-95 focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D64545]/30"
        >
          <Trash aria-hidden="true" size={17} />
        </button>
      ),
    },
  ];
}
