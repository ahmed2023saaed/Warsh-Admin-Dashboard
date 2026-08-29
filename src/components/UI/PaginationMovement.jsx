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
    'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#D9D2CC] bg-white px-3 py-2 text-sm font-medium text-[#17120E] transition-all duration-200 hover:border-[#B8A89F] hover:bg-[#F8F5F3] disabled:cursor-not-allowed disabled:border-[#E8E1DB] disabled:bg-[#F7F5F4] disabled:text-[#A59A93] sm:gap-2 sm:px-4';

  return (
    <div
      className={`flex w-full flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:gap-3 ${className}`}
    >
      <Button
        onClick={onPrevious}
        disabled={disabledPrevious}
        className={`${baseClass} ${disabledPrevious ? 'opacity-60' : ''}`}
        aria-label="Previous page"
      >
        <MoveLeftIcon className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">{previousLabel}</span>
        <span className="sm:hidden">Prev</span>
      </Button>

      {currentPage !== undefined && totalPages !== undefined && (
        <div className="order-last flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8E2D8] bg-white px-2 py-1.5 sm:order-none sm:w-auto sm:px-3">
          {onPageChange ? (
            <>
              <select
                value={currentPage}
                onChange={(e) => onPageChange(Number(e.target.value))}
                className="max-w-[70px] shrink-0 border-0 bg-transparent px-1 py-1 text-sm font-bold text-[#1C1712] outline-none sm:max-w-[90px]"
                aria-label="Select page"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="whitespace-nowrap text-sm font-medium text-[#8A8074]">
                / {totalPages}
              </span>
            </>
          ) : (
            <span className="whitespace-nowrap text-sm font-medium text-[#5A6968]">
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
        <span className="hidden sm:inline">{nextLabel}</span>
        <span className="sm:hidden">Next</span>
        <MoveRightIcon className="h-4 w-4 shrink-0" />
      </Button>
    </div>
  );
}

export default PaginationMovement;
