import { EllipsisVertical } from "lucide-react";
import Button from "../components/UI/Button";

export function Banner({ banner, onOpenActions }) {
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
