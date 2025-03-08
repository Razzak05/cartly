import { Link } from "react-router-dom";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-8 lg:px-50">
      <div className="container mx-auto flex  flex-col md:flex-row gap-8">
        <div className="relative flex-1 shadow-xl">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-[500px] rounded-xl object-cover"
          />
          <div className="absolute bg-slate-800 top-0 left-0 w-full h-full opacity-15 hover:opacity-5 rounded-md transition-all duration-300"></div>
          <div className="absolute bottom-8 left-8 bg-white bg-opacity-70 hover:bg-opacity-100  transition-all p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative flex-1 shadow-xl">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-[500px] rounded-md object-cover"
          />
          <div className="absolute bg-slate-800 top-0 left-0 w-full h-full opacity-15 hover:opacity-5 rounded-md transition-all duration-300"></div>

          <div className="absolute bottom-8 left-8 bg-white bg-opacity-70 hover:bg-opacity-100  transition-all p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
