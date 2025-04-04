import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewArrivals();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheel);
      return () => currentRef.removeEventListener("wheel", handleWheel);
    }
  }, [newArrivals]);

  return (
    <section className="relative max-w-screen-xl mx-auto p-4 scroll-smooth">
      <h2 className="text-3xl font-bold text-center mb-6">
        Explore New Arrivals
      </h2>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-white shadow-lg rounded-full z-10"
      >
        <FiChevronLeft className="text-3xl" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-white shadow-lg rounded-full z-10"
      >
        <FiChevronRight className="text-3xl" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto flex space-x-6 hide-scrollbar px-10 pb-2  h-96"
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[250px] sm:min-w-[300px] lg:min-w-[350px] bg-white shadow-md   rounded-lg overflow-hidden"
          >
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-72 object-cover"
            />
            <div className="p-4 text-center">
              <Link to={`/product/${product._id}`}>
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-gray-600 mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
