import { useState } from "react";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import FilterButton from "../components/UI/FilterButton";
import State from "../components/UI/State";
import StatCard from "../components/UI/StatCard";

function Bookings() {
  const [isActive, setIsActive] = useState("all");
  const [filterBy, setFilterBy] = useState("");

  const coutn = [10, 2560, 10, 520];

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
            count={coutn.reduce((acc, cur) => acc + cur, 0)}
          >
            All
          </FilterButton>
          <FilterButton
            active={isActive === "Pending"}
            onClick={() => handelClick("Pending")}
            count={coutn[0]}
          >
            Pending
          </FilterButton>
          <FilterButton
            active={isActive === "Active"}
            onClick={() => handelClick("Active")}
            count={coutn[1]}
          >
            Active
          </FilterButton>
          <FilterButton
            active={isActive === "Completed"}
            onClick={() => handelClick("Completed")}
            count={coutn[2]}
          >
            Completed
          </FilterButton>
          <FilterButton
            active={isActive === "Cancelled"}
            onClick={() => handelClick("Cancelled")}
            count={coutn[3]}
          >
            Cancelled
          </FilterButton>
        </div>
        <Button className="min-h-[42px] min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-2 !text-base !font-bold !text-white hover:!bg-[#332920]">
          <Download size={16} strokeWidth={2.5} />
          Export
        </Button>
      </div>
      <div className="flex flex-wrap gap-[14px]">
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </div>
    </section>
  );
}

export default Bookings;
