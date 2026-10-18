import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Everything that decides what a page shows (tab, search, filters, open item) lives in
 * the URL, so a link or a refresh opens the same view, e.g. ?tab=active&q=ahmed&customer=28
 *
 * updateParams changes several values in ONE update (separate calls in the same click
 * can overwrite each other). null / '' removes the key.
 * - resetPage: filter changes go back to page 1. true removes `page`; a prefix such as
 *   'grid' removes `gridPage` (see usePaginationParams).
 * - addToHistory: adds a history entry, e.g. when opening a drawer, so Back closes it.
 */
export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = useCallback(
    (changes, { resetPage = false, addToHistory = false } = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          Object.entries(changes).forEach(([key, value]) => {
            if (value == null || value === '') next.delete(key);
            else next.set(key, String(value));
          });

          if (resetPage === true) next.delete('page');
          else if (resetPage) next.delete(`${resetPage}Page`);

          return next;
        },
        { replace: !addToHistory }
      );
    },
    [setSearchParams]
  );

  return [searchParams, updateParams];
}

export default useUrlParams;
