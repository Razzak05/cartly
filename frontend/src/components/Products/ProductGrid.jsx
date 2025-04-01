import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="w-full h-80 mb-4 flex items-center justify-center">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="max-h-full w-auto object-contain rounded-lg"
              />
            </div>
            <h3 className="text-md font-semibold">{product.name}</h3>
            <p className="text-gray-600 font-medium tracking-tighter">
              ${product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
