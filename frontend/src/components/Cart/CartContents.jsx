import { RiDeleteBin3Line } from "react-icons/ri";

const CartContents = () => {
  const cartProducts = [
    {
      productId: 1,
      name: "T-Shirt",
      size: "M",
      color: "Red",
      quantity: 1,
      price: 15,
      image: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Navy Blue",
      quantity: 1,
      price: 5,
      image: "https://picsum.photos/200?random=1",
    },
  ];

  return (
    <div>
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex p-4 border-b justify-between items-center flex-col sm:flex-row"
        >
          <div className="flex items-center flex-col sm:flex-row text-center sm:text-left mb-4 sm:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 mr-0 sm:mr-4 rounded mb-2 sm:mb-0"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm">
                size: {product.size} | color: {product.color}
              </p>
              <div className="flex mt-2 justify-center sm:justify-start">
                <button className="border rounded px-2 py-1">-</button>
                <span className="mx-4">{product.quantity}</span>
                <button className="border rounded px-2 py-1">+</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p>${product.price.toLocaleString()}</p>
            <button>
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
