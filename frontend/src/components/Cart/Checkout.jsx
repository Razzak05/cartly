import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PaypalButton from "./PaypalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice.js";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [checkoutId, setCheckoutId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: user?.email || "zayn@example.com",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Redirect to home if the cart is empty
  useEffect(() => {
    if (!cart?.products?.length) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Validate form fields before checkout creation
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim())
      errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.country.trim()) errors.country = "Country is required.";
    if (!/^\d{4,6}$/.test(formData.postalCode))
      errors.postalCode = "Enter a valid postal code.";
    if (!/^\d{10}$/.test(formData.phone))
      errors.phone = "Enter valid 10-digit phone number.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create a checkout session by dispatching the createCheckout action
  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (cart && cart.products.length > 0) {
      try {
        const result = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress: formData,
            paymentMethod: "Paypal",
            totalPrice: cart.totalPrice,
          })
        );
        if (result.payload && result.payload._id) {
          setCheckoutId(result.payload._id);
        }
      } catch (err) {
        console.error("Error creating checkout:", err);
      }
    }
  };

  // Handle successful payment by marking the checkout as paid and finalizing the order
  const handlePaymentSuccess = async (details) => {
    try {
      if (!checkoutId) {
        throw new Error("Invalid checkout id");
      }
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        await handleFinalizeCheckout();
      }
    } catch (error) {
      console.error("Payment success error:", error);
    }
  };

  // Finalize the checkout by converting it into an order and navigating to the confirmation page
  const handleFinalizeCheckout = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error("Finalize checkout error:", error);
    }
  };

  if (loading) return <p>Loading Cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart?.products?.length) return <p>Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">CHECKOUT</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <form
          id="checkout-form"
          onSubmit={handleCreateCheckout}
          className="space-y-6"
        >
          <section>
            <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
            <div className="bg-blue-50 p-4 rounded-md">
              <p>{formData.email}</p>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-4">Delivery</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.address}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {formErrors.postalCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.postalCode}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {formErrors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.country}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
          </section>
        </form>
        <div className="bg-gray-50 p-6 rounded">
          <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
          {cart.products.map((item) => (
            <div key={item._id} className="flex justify-between mb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
                <p className="text-sm text-gray-600">Color: {item.color}</p>
              </div>
              <p className="font-medium">${item.price.toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          {!checkoutId ? (
            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-black text-white py-3 rounded mt-6"
            >
              Continue to Payment
            </button>
          ) : (
            <div className="mt-6">
              <PaypalButton
                amount={cart.totalPrice}
                onSuccess={handlePaymentSuccess}
                onError={() => alert("Payment Failed, Try Again!")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
