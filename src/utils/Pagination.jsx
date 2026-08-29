import { useEffect, useState } from 'react';
import PaginationMovement from '../components/UI/PaginationMovement';

function Pagination({ data, perPage = 10, onPaginate }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginated = data.slice((currentPageSafe - 1) * perPage, currentPageSafe * perPage);

  const disabledPre = currentPageSafe === 1;
  const disabledNext = currentPageSafe === totalPages;

  useEffect(() => {
    onPaginate(paginated);
  }, [data, perPage, currentPage, onPaginate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  function handelPreviousPage() {
    if (currentPageSafe <= 1) return;
    setCurrentPage((prev) => prev - 1);
  }

  function handelNextPage() {
    if (currentPageSafe >= totalPages) return;
    setCurrentPage((prev) => prev + 1);
  }

  return (
    <div>
      <PaginationMovement
        disabledPrevious={disabledPre}
        disabledNext={disabledNext}
        onPrevious={handelPreviousPage}
        onNext={handelNextPage}
        currentPage={currentPageSafe}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Pagination;
