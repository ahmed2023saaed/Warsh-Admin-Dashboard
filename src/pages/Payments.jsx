import { useMemo, useState } from "react";
import FilterButton from "../components/UI/FilterButton";
import StatCard from "../components/UI/StatCard";
import { paymentTabs } from "../constants/paymentsConstants";
import { paymentsStatCards } from "../Data/PaymentMocks";
import { paymentsMockData } from "../Data/paymentMockData";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import { getPaymentColumns } from "../constants/paymentColumns";
import DataTable from "../components/UI/DataTable";



function Payments() {

  const [isActive, setIsActive] = useState('bookingFees')
  const activeData = paymentsMockData[isActive]

  const paymentColumns = useMemo(
    () => getPaymentColumns(isActive),
    [isActive]
  )

  return (
    <div className="min-w-0 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {paymentsStatCards.map((card) => (
          <StatCard
            key={card.key}
            {...card}
            className="p-4"
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-wrap gap-2">

          {paymentTabs.map((payment) => (
            <FilterButton
              key={payment.key}
              count={payment.key.length}
              active={isActive === payment.key}
              onClick={() => { setIsActive(payment.key) }}
              className="text-xs"
            >
              {payment.label}
            </FilterButton>
          ))}
        </div>

        <div className="flex gap-2">

          <Button className="min-h-[35px] min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-0 !text-xs !font-bold !text-white hover:!bg-[#332920]">
            <Download size={16} strokeWidth={2.5} />
            Excel
          </Button>

          <Button className="min-h-[35px] min-w-0 gap-2 !rounded-[9px] !border-[#1C1712] !bg-[#1C1712] !px-[14px] !py-0 !text-xs !font-bold !text-white hover:!bg-[#332920]">
            <Download size={16} strokeWidth={2.5} />
            PDF
          </Button>
        </div>

      </div>

        <DataTable
          columns={paymentColumns}
          data={activeData}
          emptyMessage="No payment records found."
          minWidth={isActive === 'refunds' ? '1450px' : '1000px'}
        />


    </div>
  );
}

export default Payments;
