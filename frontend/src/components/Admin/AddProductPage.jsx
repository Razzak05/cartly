import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../redux/slices/productsSlice";
import axios from "axios";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "Unisex",
    images: [],
    isFeatured: false,
    isPublished: false,
    tags: "",
    dimensions: { length: "", width: "", height: "" },
    weight: "",
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Generic change handler for inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("dimensions.")) {
      const field = name.split(".")[1];
      setProductData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [field]: value },
      }));
    } else if (type === "checkbox") {
      setProductData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload image via Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { withCredentials: true }
      );
      // Push returned image object to images array
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error("Image upload error:", error);
      setUploading(false);
    }
  };

  // Form submit handler dispatches the addProduct thunk
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare payload
    const payload = {
      ...productData,
      price: Number(productData.price),
      discountPrice: productData.discountPrice
        ? Number(productData.discountPrice)
        : undefined,
      countInStock: Number(productData.countInStock),
      sizes: productData.sizes.split(",").map((s) => s.trim()),
      colors: productData.colors.split(",").map((c) => c.trim()),
      tags: productData.tags.split(",").map((t) => t.trim()),
      collections: productData.collections,
      dimensions: {
        length: Number(productData.dimensions.length),
        width: Number(productData.dimensions.width),
        height: Number(productData.dimensions.height),
      },
      weight: Number(productData.weight),
    };

    try {
      await dispatch(addProduct(payload)).unwrap();
      setMessage("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product...");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Add Product</h2>
      {message && <p className="text-red-600 font-medium">{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Discount Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Discount Price</label>
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Total Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Total Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Collection */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collection</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
          {uploading && (
            <p className="text-sm text-gray-500">Uploading image...</p>
          )}
        </div>

        {/* isFeatured */}
        <div className="mb-6">
          <label className="inline-block font-semibold mr-4">Is Featured</label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={productData.isFeatured}
            onChange={handleChange}
          />
        </div>

        {/* isPublished */}
        <div className="mb-6">
          <label className="inline-block font-semibold mr-4">
            Is Published
          </label>
          <input
            type="checkbox"
            name="isPublished"
            checked={productData.isPublished}
            onChange={handleChange}
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={productData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Dimensions */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Dimensions (Length, Width, Height)
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="dimensions.length"
              placeholder="Length"
              value={productData.dimensions.length}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              type="number"
              name="dimensions.width"
              placeholder="Width"
              value={productData.dimensions.width}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              type="number"
              name="dimensions.height"
              placeholder="Height"
              value={productData.dimensions.height}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Weight */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Weight</label>
          <input
            type="number"
            name="weight"
            value={productData.weight}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
