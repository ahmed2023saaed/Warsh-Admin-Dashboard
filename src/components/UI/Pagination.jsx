/** BUT THIS I THE PAGE U R BULDING
 * const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;

const totalPages = Math.ceil(bookings.length / pageSize);

bookings.length ==> num of rows in the data or table
const startIndex = (currentPage - 1) * pageSize;

const pageRows = bookings.slice(
  startIndex,
  startIndex + pageSize
);

-----------------
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
 */

import Button from "./Button";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between border-t border-[#E8E2D8] px-4 py-3">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <span className="text-sm text-[#8A8074]">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
