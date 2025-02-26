import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const suggestions = [
  "Jeans",
  "T-Shirts",
  "Shirts",
  "Chinos",
  "Polos",
  "Kurti",
  "Sweaters",
  "Jackets",
  "Shorts",
  "Dresses",
];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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
    console.log("Search Term: ", setSearchTerm);
    setIsOpen(false);
  };

  return (
    <div
      className={`flex items-center justify-center transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : ""
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange} // Now uses the new function
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded focus:outline-none w-full placeholder:text-gray-700"
            />
            {/* Search icon */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
