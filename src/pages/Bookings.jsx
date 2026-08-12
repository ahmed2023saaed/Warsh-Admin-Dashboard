import { useState } from "react";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import FilterButton from "../components/UI/FilterButton";

function Bookings() {
  const [isActive, setIsActive] = useState("all");

  const coutn = [10, 2560, 10, 520];
  const filteres = ["all", "Pending", "Active", "Completed"];

  function handelClick(name) {
    setIsActive(name);
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-2">
          {filteres.map((filter, i) => (
            <FilterButton
              key={filter}
              active={isActive === filter}
              onClick={() => handelClick(filter)}
              count={
                filter == "all"
                  ? coutn.reduce((acc, cur) => acc + cur, 0)
                  : coutn[i]
              }
            >
              {filter}
            </FilterButton>
          ))}
        </div>
        <Button className="min-h-[42px] min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-2 !text-base !font-bold !text-white hover:!bg-[#332920]">
          <Download size={16} strokeWidth={2.5} />
          Export
        </Button>
      </div>
    </section>
  );
}

export default Bookings;
