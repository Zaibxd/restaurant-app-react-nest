import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cart_store";

const Navbar: React.FC = () => {
  const cart = useCartStore(state => state.cart);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">
        <Link to="/">MyRestaurant</Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:underline">Home</Link>

        {/* Cart */}
        <Link to="/cart" className="relative flex items-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13"
            />
          </svg>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        <Link to="/login" className="flex items-center hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm89.6 32h-11.7c-22.2 10.2-46.8 16-77.9 16s-55.7-5.8-77.9-16h-11.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
