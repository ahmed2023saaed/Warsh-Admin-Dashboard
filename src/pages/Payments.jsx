import { useMemo } from "react";
import FilterButton from "../components/UI/FilterButton";
import StatCard from "../components/UI/StatCard";
import { paymentTabs } from "../constants/paymentsConstants";
import { paymentsStatCards } from "../Data/PaymentMocks";
import { paymentsMockData } from "../Data/paymentMockData";
import { Download } from "lucide-react";
import Button from "../components/UI/Button";
import { getPaymentColumns } from "../constants/paymentColumns";
import DataTable from "../components/UI/DataTable";
import Pagination from "../components/UI/Pagination";
import { paginate, usePaginationParams } from "../hooks/usePaginationParams";
import { useUrlParams } from "../hooks/useUrlParams";

const DEFAULT_TAB = 'bookingFees'

function Payments() {

  // The tab and page live in the URL: ?tab=refunds&page=2&size=20
  const [searchParams, updateParams] = useUrlParams()
  const { page, pageSize, setPage, setPageSize, sizeOptions } = usePaginationParams()
  const requestedTab = searchParams.get('tab')
  const isActive = paymentTabs.some((tab) => tab.key === requestedTab) ? requestedTab : DEFAULT_TAB
  const activeData = paymentsMockData[isActive]
  const paginatedPayments = paginate(activeData, page, pageSize)

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
              onClick={() => {
                updateParams(
                  { tab: payment.key === DEFAULT_TAB ? null : payment.key },
                  { resetPage: true }
                )
              }}
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
          data={paginatedPayments}
          emptyMessage="No payment records found."
          minWidth={isActive === 'refunds' ? '1450px' : '1000px'}
        />
        {activeData.length > 0 && (
          <Pagination
            currentPage={page}
            totalItems={activeData.length}
            pageSize={pageSize}
            onPageChange={setPage}
            pageSizeOptions={sizeOptions}
            onPageSizeChange={setPageSize}
          />
        )}


    </div>
  );
}

export default Payments;
