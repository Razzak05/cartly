import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOption from "../components/Products/SortOption";
import ProductGrid from "../components/Products/ProductGrid";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setisSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setisSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setisSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Add cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Added empty dependency array to prevent continuous re-execution

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          _id: 101,
          name: "Placeholder Product 1",
          price: 199,
          images: [{ url: "https://picsum.photos/500/500?random=10" }],
        },
        {
          _id: 102,
          name: "Placeholder Product 2",
          price: 249,
          images: [{ url: "https://picsum.photos/500/500?random=11" }],
        },
        {
          _id: 103,
          name: "Placeholder Product 3",
          price: 299,
          images: [{ url: "https://picsum.photos/500/500?random=12" }],
        },
        {
          _id: 104,
          name: "Placeholder Product 4",
          price: 349,
          images: [{ url: "https://picsum.photos/500/500?random=13" }],
        },
        {
          _id: 105,
          name: "Placeholder Product 5",
          price: 399,
          images: [{ url: "https://picsum.photos/500/500?random=14" }],
        },
        {
          _id: 106,
          name: "Placeholder Product 6",
          price: 449,
          images: [{ url: "https://picsum.photos/500/500?random=15" }],
        },
        {
          _id: 107,
          name: "Placeholder Product 7",
          price: 499,
          images: [{ url: "https://picsum.photos/500/500?random=16" }],
        },
        {
          _id: 108,
          name: "Placeholder Product 8",
          price: 549,
          images: [{ url: "https://picsum.photos/500/500?random=17" }],
        },
      ];
      setProducts(fetchedProducts);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter button */}
      <button
        className="lg:hidden border p-2 flex justify-center items-center"
        onClick={toggleSidebar}
      >
        <FaFilter className="mr-2" />
        Filter
      </button>

      {/* Filter Sidebar */}

      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50  w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort Options */}
        <SortOption />

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default CollectionPage;
