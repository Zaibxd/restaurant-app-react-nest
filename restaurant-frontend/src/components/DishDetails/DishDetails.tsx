import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCartStore } from "../../store/cart_store";
import { Link } from "react-router-dom";
import { type Dish } from "./DishDetails_types";



const DishDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [quantity] = useState(1);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    const dummyDishes: Dish[] = [
      { id: 1, name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, tomato sauce, and basil.", price: 8.99, image: "https://source.unsplash.com/400x300/?pizza" },
      { id: 2, name: "Cheeseburger", description: "Juicy beef patty with cheddar, lettuce, tomato, and special sauce.", price: 6.5, image: "https://source.unsplash.com/400x300/?burger" },
      { id: 3, name: "Caesar Salad", description: "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing.", price: 5.99, image: "https://source.unsplash.com/400x300/?salad" },
      { id: 4, name: "Spaghetti Bolognese", description: "Classic Italian pasta with rich meat sauce and parmesan.", price: 9.5, image: "https://source.unsplash.com/400x300/?spaghetti" },
      { id: 5, name: "Chocolate Cake", description: "Decadent chocolate cake with a creamy ganache topping.", price: 4.75, image: "https://source.unsplash.com/400x300/?chocolate-cake" },
    ];
    setDish(dummyDishes.find(d => d.id === Number(id)) || null);
  }, [id]);

  if (!dish) return <p className="text-center mt-10">Dish not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Dish Info */}
      <div className="flex-1">
        <img src={dish.image} alt={dish.name} className="w-full h-64 object-cover rounded mb-4" />
        <h1 className="text-3xl font-bold">{dish.name}</h1>
        <p className="text-gray-700 mt-2">{dish.description}</p>
        <p className="text-red-600 font-semibold mt-2 text-xl">${dish.price.toFixed(2)}</p>

        <div className="mt-6 flex items-center space-x-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => addToCart({ id: dish.id, name: dish.name, price: dish.price, quantity })}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default DishDetails;



export const CartSidebar: React.FC = () => {
  const cart = useCartStore(state => state.cart);
  const addToCart = useCartStore(state => state.addToCart);

  // Increment / Decrement helpers
  const increment = (id: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    addToCart({ ...item, quantity: 1 });
  };

  const decrement = (id: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    addToCart({ ...item, quantity: -1 }); // store removes item if quantity <= 0
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full md:w-80 border p-6 rounded-lg shadow-lg bg-white flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M7 13l-2-6m0 0L3 3m0 0h18m-3 9l1.5 7M5 6h.01"></path>
          </svg>
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="mt-2 text-gray-400 text-sm">Add some delicious dishes to get started!</p>
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <ul className="space-y-3 overflow-y-auto max-h-96">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => decrement(item.id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => increment(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-4 flex justify-between items-center font-bold text-gray-800">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to='/cart' className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
};
