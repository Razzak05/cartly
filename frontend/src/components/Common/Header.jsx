import CartDrawer from "../Layout/CartDrawer";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="border-b border-b-gray-200">
      {/* Navbar */}
      <Navbar />
      {/* Topbar */}
      <Topbar />
      {/* Cart Drawer */}
      <CartDrawer />
    </header>
  );
};

export default Header;
