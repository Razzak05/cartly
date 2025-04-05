import { useDispatch } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle updating quantity
  const handleQuantityChange = (product, delta) => {
    const newQuantity = product.quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId: product.productId || product._id, // adjust based on your data shape
          quantity: newQuantity,
          userId,
          guestId,
          size: product.size,
          color: product.color,
        })
      );
    }
  };

  // Handle removing an item
  const handleRemoveItem = (product) => {
    dispatch(
      removeFromCart({
        productId: product.productId || product._id,
        userId,
        guestId,
        size: product.size,
        color: product.color,
      })
    );
  };

  return (
    <div className="cart-contents">
      {cart.products &&
        cart.products.map((product) => (
          <div
            key={`${product.productId || product._id}-${product.size}-${
              product.color
            }`}
            className="cart-item flex p-4 border-b justify-between items-center flex-col sm:flex-row"
          >
            <div className="flex items-center flex-col sm:flex-row text-center sm:text-left mb-4 sm:mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 mr-0 sm:mr-4 rounded mb-2 sm:mb-0 object-cover"
              />
              <div className="product-info">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  Size: {product.size} | Color: {product.color}
                </p>
                <div className="quantity-control flex mt-2 justify-center sm:justify-start">
                  <button
                    className="border rounded px-3 py-1 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(product, -1)}
                  >
                    -
                  </button>
                  <span className="mx-4 w-6 text-center">
                    {product.quantity}
                  </span>
                  <button
                    className="border rounded px-3 py-1 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(product, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-medium">${product.price.toFixed(2)}</p>
              <button
                onClick={() => handleRemoveItem(product)}
                className="mt-2 hover:text-red-700"
              >
                <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CartContents;
