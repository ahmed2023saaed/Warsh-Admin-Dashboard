function DataTable({
  columns,
  rows,
  getRowId,
  page,
  pageSize,
  totalItems,
  onPageChange,
  emptyMessage = "No data found",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;

  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#E8E2D8] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead className="bg-[#FDFBF8]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4 py-3 text-start text-[11px] font-bold tracking-wide text-[#8A8074] uppercase"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="border-t border-[#E8E2D8] hover:bg-[#FDFBF8]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-[#1C1712]"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-[#8A8074]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#E8E2D8] px-4 py-3">
        <p className="text-sm text-[#8A8074]">
          Showing {firstItem}-{lastItem} of {totalItems}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[#E8E2D8] px-3 py-1.5 text-sm font-semibold text-[#1C1712] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[#E8E2D8] px-3 py-1.5 text-sm font-semibold text-[#1C1712] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
