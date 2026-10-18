import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Page sizes the user can pick from; the first one is the default. */
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

/**
 * Keeps a table's page number and page size in the URL, e.g. ?page=2&size=20.
 * Pass a prefix when one page has several tables: usePaginationParams('grid')
 * → ?gridPage=2&gridSize=20. Pass sizeOptions for lists that need other sizes.
 */
export function usePaginationParams(prefix = '', sizeOptions = PAGE_SIZE_OPTIONS) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageKey = prefix ? `${prefix}Page` : 'page';
  const sizeKey = prefix ? `${prefix}Size` : 'size';

  const requestedSize = Number(searchParams.get(sizeKey));
  const pageSize = sizeOptions.includes(requestedSize) ? requestedSize : sizeOptions[0];

  const requestedPage = Number(searchParams.get(pageKey));
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const update = useCallback(
    (nextPage, nextSize) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          next.set(pageKey, String(nextPage));
          next.set(sizeKey, String(nextSize));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams, pageKey, sizeKey]
  );

  const setPage = useCallback((nextPage) => update(nextPage, pageSize), [update, pageSize]);
  // A new page size changes how many pages exist, so start again from page 1.
  const setPageSize = useCallback((nextSize) => update(1, nextSize), [update]);

  return { page, pageSize, setPage, setPageSize, sizeOptions };
}

/** The rows for the current page of a list that's already in memory. */
export function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  return items.slice((safePage - 1) * pageSize, safePage * pageSize);
}

export default usePaginationParams;
