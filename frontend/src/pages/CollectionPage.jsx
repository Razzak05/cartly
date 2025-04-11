// src/pages/CollectionPage.jsx

import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOption from "../components/Products/SortOption";
import ProductGrid from "../components/Products/ProductGrid";
import Pagination from "../components/Common/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { products, loading, error, pagination } = useSelector(
    (state) => state.products
  );
  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    // Dispatch filters including pagination parameters (e.g., page and limit)
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-8">
      {/* Mobile Filter button */}
      <button
        className="lg:hidden border p-3 mb-4 rounded-md flex justify-center items-center"
        onClick={toggleSidebar}
      >
        <FaFilter className="mr-2" />
        Filter
      </button>

      {/* Mobile overlay backdrop when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative fixed inset-y-0 left-0 w-72 bg-white shadow-lg overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:w-64 lg:mr-6 lg:shadow-none`}
      >
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={toggleSidebar} className="text-gray-500">
            ✕
          </button>
        </div>
        <FilterSidebar />
      </div>

      <div className="flex-grow p-2 lg:p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* Sort Options */}
        <SortOption />
        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
        {/* Pagination: Only render if total pages is greater than one */}
        {pagination.pages > 1 && (
          <Pagination page={pagination.page} pages={pagination.pages} />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
