import { useState } from "react";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import FilterButton from "../components/UI/FilterButton";

function Bookings() {
  const [isActive, setIsActive] = useState("all");
  const [filterBy, setFilterBy] = useState("");

  const coutn = [10, 20, 10, 50];

  function handelClick(name) {
    setIsActive(name);
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={isActive === "all"}
            onClick={() => handelClick("all")}
          >
            All <span>{coutn.reduce((acc, cur) => acc + cur, 0)}</span>
          </FilterButton>
          <FilterButton
            active={isActive === "Pending"}
            onClick={() => handelClick("Pending")}
          >
            Pending <span>{coutn[0]}</span>
          </FilterButton>
          <FilterButton
            active={isActive === "Active"}
            onClick={() => handelClick("Active")}
          >
            Active <span>{coutn[1]}</span>
          </FilterButton>
          <FilterButton
            active={isActive === "Completed"}
            onClick={() => handelClick("Completed")}
          >
            Completed <span>{coutn[2]}</span>
          </FilterButton>
          <FilterButton
            active={isActive === "Cancelled"}
            onClick={() => handelClick("Cancelled")}
          >
            Cancelled <span>{coutn[3]}</span>
          </FilterButton>
        </div>
        <Button className="min-h-[38px] min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-2 !text-sm !font-bold !text-white hover:!bg-[#332920]">
          <Download size={14} strokeWidth={2.5} />
          Export
        </Button>
      </div>
    </section>
  );
}

export default Bookings;
