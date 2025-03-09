import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";

const placeholderProducts = [
  {
    _id: 101,
    name: "Placeholder Product 1",
    price: 199,
    images: [{ url: "https://picsum.photos/500/500?random=10" }],
  },
  {
    _id: 102,
    name: "Placeholder Product 2",
    price: 249,
    images: [{ url: "https://picsum.photos/500/500?random=11" }],
  },
  {
    _id: 103,
    name: "Placeholder Product 3",
    price: 299,
    images: [{ url: "https://picsum.photos/500/500?random=12" }],
  },
  {
    _id: 104,
    name: "Placeholder Product 4",
    price: 349,
    images: [{ url: "https://picsum.photos/500/500?random=13" }],
  },
  {
    _id: 105,
    name: "Placeholder Product 5",
    price: 399,
    images: [{ url: "https://picsum.photos/500/500?random=14" }],
  },
  {
    _id: 106,
    name: "Placeholder Product 6",
    price: 449,
    images: [{ url: "https://picsum.photos/500/500?random=15" }],
  },
  {
    _id: 107,
    name: "Placeholder Product 7",
    price: 499,
    images: [{ url: "https://picsum.photos/500/500?random=16" }],
  },
  {
    _id: 108,
    name: "Placeholder Product 8",
    price: 549,
    images: [{ url: "https://picsum.photos/500/500?random=17" }],
  },
];

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>

      <ProductDetails />

      <div className="container mx-auto"></div>
    </div>
  );
};

export default Home;
