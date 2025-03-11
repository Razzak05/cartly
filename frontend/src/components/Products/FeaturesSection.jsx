import { FaUndo, FaLock } from "react-icons/fa";

const Features = () => {
  return (
    <section className="container mx-auto py-12 px-4">
      <div className=" flex flex-col md:flex-row justify-between items-center gap-24">
        {/* Tagline */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">Quality You Can Trust</h2>
          <p className="text-gray-600">Premium products crafted for you</p>
        </div>

        {/* 45 Days Return */}
        <div className="text-center">
          <FaUndo size={28} className="mx-auto mb-2" />
          <h3 className="text-lg font-semibold">45 DAYS RETURN</h3>
          <p className="text-gray-600">Money-back guarantee</p>
        </div>

        {/* Secure Checkout */}
        <div className="text-center">
          <FaLock size={28} className="mx-auto mb-2" />
          <h3 className="text-lg font-semibold">SECURE CHECKOUT</h3>
          <p className="text-gray-600">100% secured checkout process</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
