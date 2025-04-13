import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import StarRating from "../Common/StarRating.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
  addProductReview,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice.js";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  // Assuming orders are available in state.orders if you have fetched them
  const { orders } = useSelector((state) => state.orders);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Reviews state for local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10; // fixed at 10 reviews per load
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const reviewsRef = useRef(null);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
      setCurrentPage(1); // Reset pagination when product changes
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size.", { duration: 1000 });
      return;
    } else if (!selectedColor) {
      toast.error("Please select a color", { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // Check if the user has purchased the product
  const purchasedOrder = orders?.find((order) =>
    order.orderItems.find(
      (item) => item.productId.toString() === productFetchId
    )
  );
  const hasPurchased = Boolean(purchasedOrder);

  // Review submission handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to submit a review", {
        duration: 2000,
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please enter a review comment", { duration: 1000 });
      return;
    }

    setIsSubmittingReview(true);

    dispatch(
      addProductReview({
        productId: productFetchId,
        rating: newReview.rating,
        comment: newReview.comment,
      })
    )
      .then(() => {
        toast.success("Review submitted successfully!", { duration: 1000 });
        setNewReview({ rating: 5, comment: "" });
        // Refresh the product details to update reviews
        dispatch(fetchProductDetails(productFetchId));
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to submit review", {
          duration: 2000,
        });
      })
      .finally(() => {
        setIsSubmittingReview(false);
      });
  };

  // Scroll to reviews section
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Local pagination for reviews:
  // Show first (currentPage * reviewsPerPage) reviews
  const reviews = selectedProduct?.reviews || [];
  const currentReviews = reviews.slice(0, currentPage * reviewsPerPage);
  const hasMoreReviews = currentReviews.length < reviews.length;

  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-4 md:p-8 rounded-lg">
          {/* Product Info Section (existing code) */}
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="w-full h-full">
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-auto max-h-96 md:max-h-[500px] object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Mobile Thumbnails */}
            <div className="md:hidden flex overflow-x-auto space-x-4 mb-4 py-2">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index}`}
                  className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Product Information */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              <div className="flex items-center mb-2">
                <StarRating rating={selectedProduct.averageRating} />
                <button
                  onClick={scrollToReviews}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {selectedProduct.reviewCount} reviews
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.originalPrice}
              </p>
              <p className="text-xl text-gray-500 mb-2">
                ${selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>

              {/* Color Selection */}
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border ${
                        selectedColor === color
                          ? "border-2 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.8)",
                      }}
                      aria-label={`Select ${color} color`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded text-lg"
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded text-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-3 px-6 rounded w-full mb-4 ${
                  isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isButtonDisabled ? "ADDING TO CART..." : "ADD TO CART"}
              </button>

              {/* Characteristics */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div ref={reviewsRef} className="mt-20 border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

            {/* Review Form */}
            <div className="mb-10 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              {!user ? (
                <p className="text-gray-600">
                  Please log in to write a review.
                </p>
              ) : !hasPurchased ? (
                <p className="text-gray-600">
                  Only buyers who purchased this product can write a review.
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReview({ ...newReview, rating: star })
                          }
                          className="text-2xl text-yellow-500 focus:outline-none"
                        >
                          {star <= newReview.rating ? "★" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      rows="4"
                      placeholder="Share your experience with this product..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className={`bg-black text-white py-2 px-6 rounded-md ${
                      isSubmittingReview
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-gray-600 text-center py-6">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <>
                <div className="space-y-6">
                  {currentReviews.map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{review.name}</span>
                          <div className="flex items-center mt-1">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Show More Button */}
                {hasMoreReviews && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleShowMore}
                      className="text-blue-600 hover:underline"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
