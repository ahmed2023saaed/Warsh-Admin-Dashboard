import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAppTranslation from '../../hooks/useAppTranslation';

// Every page when there are only a few; otherwise the first, last and the ones around
// the current page, with gaps in between: 1 … 4 5 6 … 12
function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? [`gap-${page}`, page] : [page]
  );
}

/**
 * Shared pagination for paginated dashboard lists.
 * Pass pageSizeOptions + onPageSizeChange to show a "Rows per page" picker.
 * Use it with usePaginationParams so the page and size live in the URL.
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  disabled = false,
  labels = {},
  className = '',
}) {
  const { t } = useAppTranslation('common');
  const text = (key, fallback) => labels[key] || t('pagination.' + key, { defaultValue: fallback });
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const firstItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, totalItems);
  const goToPage = (page) => onPageChange(Math.min(Math.max(page, 1), totalPages));
  const showSizePicker = Boolean(pageSizeOptions?.length > 1 && onPageSizeChange);

  return (
    <nav
      className={`flex flex-wrap items-center justify-between gap-3 px-1 py-2 ${className}`}
      aria-label={text('navigation', 'Pagination')}
    >
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs text-[#5A6968]">
          {text('showing', 'Showing')}{' '}
          <span className="font-semibold text-[#15201F]">
            {firstItem}–{lastItem}
          </span>{' '}
          {text('of', 'of')} <span className="font-semibold text-[#15201F]">{totalItems}</span>
        </p>

        {showSizePicker && (
          <label className="flex items-center gap-2 text-xs text-[#5A6968]">
            {text('rowsPerPage', 'Rows per page')}
            <select
              value={pageSize}
              disabled={disabled}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-md border border-[#E8E2D8] bg-white px-2 py-1 text-xs font-semibold text-[#15201F] focus:border-[#E08B2F] focus:outline-none"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(safePage - 1)}
          disabled={disabled || safePage === 1}
          aria-label={text('previous', 'Previous page')}
          className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>

        {getPageItems(safePage, totalPages).map((page) =>
          typeof page === 'string' ? (
            <span key={page} aria-hidden="true" className="px-1 text-xs text-[#8A8074]">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              disabled={disabled}
              aria-current={safePage === page ? 'page' : undefined}
              className={`flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-md px-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                safePage === page ? 'bg-[#1C1712] text-white' : 'text-[#5A5045] hover:bg-[#F2EDE4]'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => goToPage(safePage + 1)}
          disabled={disabled || safePage === totalPages}
          aria-label={text('next', 'Next page')}
          className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
