import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productsSlice";

const suggestions = [
  "jeans",
  "t-shirts",
  "shirts",
  "chinos",
  "polos",
  "kurti",
  "sweaters",
  "jackets",
  "shorts",
  "dresses",
];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes (updates searchTerm only)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSuggestion(value); // Trigger suggestion filtering after updating searchTerm
  };

  // Handle suggestion filtering (focuses only on suggestions)
  const handleSuggestion = (value) => {
    if (value.length > 0) {
      setFilteredSuggestions(
        suggestions.filter((item) =>
          item.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  // Handle search toggle
  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    setSearchTerm(""); // Clear input on close
    setFilteredSuggestions([]); // Clear suggestions
  };

  // Handle suggestion selection
  const handleSelect = (value) => {
    setSearchTerm(value);
    setFilteredSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      {isOpen ? (
        <div className="fixed top-0 left-0 w-full h-24 bg-white z-50 shadow-md">
          <form
            onSubmit={handleSearch}
            className="flex items-center justify-center w-full h-full px-6"
          >
            <div className="relative w-full max-w-3xl">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleInputChange}
                autoFocus
                className="bg-gray-100 px-4 py-3 pl-4 pr-12 rounded focus:outline-none w-full placeholder:text-gray-700"
              />
              {/* Search icon */}
              <button
                type="submit"
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                <HiMagnifyingGlass className="h-6 w-6" />
              </button>
              {/* Suggestions dropdown */}
              {filteredSuggestions.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 shadow-md z-50">
                  {filteredSuggestions.map((item, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Close button */}
            <button
              onClick={handleSearchToggle}
              type="button"
              className="ml-4 text-gray-600 hover:text-gray-800"
            >
              <HiMiniXMark className="h-6 w-6" />
            </button>
          </form>
        </div>
      ) : (
        <button onClick={handleSearchToggle} className="hover:text-black">
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
