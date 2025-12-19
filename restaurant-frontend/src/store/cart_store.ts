import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore } from "./cart_types";


export const useCartStore = create<CartStore>()(
  persist(
    set => ({
      cart: [],

      addToCart: product =>
        set(state => {
          const existing = state.cart.find(i => i.id === product.id);

          if (!existing && product.quantity <= 0) return state;

          const updatedCart = existing
            ? state.cart
                .map(item =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + product.quantity }
                    : item
                )
                .filter(item => item.quantity > 0)
            : [...state.cart, product];

          return { cart: updatedCart };
        }),

      removeFromCart: id =>
        set(state => ({
          cart: state.cart.filter(item => item.id !== id),
        })),

      resetCart: ()=> set({ cart : []}),

    }),
    {
      name: "shopping-cart",
    }
  )
);
