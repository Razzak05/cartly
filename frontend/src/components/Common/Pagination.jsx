// src/components/Products/Pagination.jsx

import { useSearchParams } from "react-router-dom";

const Pagination = ({ page, pages }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    searchParams.set("page", newPage);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-center justify-center space-x-4 my-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <p className="text-lg">
        {page} of {pages} pages
      </p>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
