import { MoveLeftIcon, MoveRightIcon } from 'lucide-react';
import Button from './Button';

function PaginationMovement({
  onPrevious,
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  disabledPrevious = false,
  disabledNext = false,
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) {
  const baseClass =
    'inline-flex items-center gap-2 rounded-xl border border-[#D9D2CC] bg-white px-4 py-2 text-sm font-medium text-[#17120E] transition-all duration-200 hover:border-[#B8A89F] hover:bg-[#F8F5F3] disabled:cursor-not-allowed disabled:border-[#E8E1DB] disabled:bg-[#F7F5F4] disabled:text-[#A59A93] -mt-2';

  const selectClass =
    'max-w-[90px] rounded-xl border border-[#E8E2D8] bg-white px-2.5 py-2 text-sm font-semibold text-[#1C1712] outline-none transition focus:border-[#E08B2F] focus:ring-2 focus:ring-[#E08B2F]/15';

  return (
    <div className={`flex w-full items-center justify-between gap-2 ${className}`}>
      <Button
        onClick={onPrevious}
        disabled={disabledPrevious}
        className={`${baseClass} ${disabledPrevious ? 'opacity-60' : ''}`}
        aria-label="Previous page"
      >
        <MoveLeftIcon className="h-4 w-4" />
        <span>{previousLabel}</span>
      </Button>

      {currentPage !== undefined && totalPages !== undefined && (
        <div className="flex items-center gap-2 rounded-xl border border-[#E8E2D8] bg-white px-3 py-1.5">
          {onPageChange ? (
            <>
              <select
                value={currentPage}
                onChange={(e) => onPageChange(Number(e.target.value))}
                className="max-w-[90px] border-0 bg-transparent px-1 py-1 text-sm font-bold text-[#1C1712] outline-none"
                aria-label="Select page"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="text-sm font-medium text-[#8A8074]">/ {totalPages}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-[#5A6968]">
              {currentPage} / {totalPages}
            </span>
          )}
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={disabledNext}
        className={`${baseClass} ${disabledNext ? 'opacity-60' : ''}`}
        aria-label="Next page"
      >
        <span>{nextLabel}</span>
        <MoveRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default PaginationMovement;
