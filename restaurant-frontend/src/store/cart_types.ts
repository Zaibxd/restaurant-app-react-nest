export type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
  };
  
export type AddToCartPayload = Omit<CartItem, "quantity"> & {
  quantity: number;
};

export type CartStore = {
  cart: CartItem[];
  addToCart: (item: AddToCartPayload) => void;
  removeFromCart: (id: number) => void;
  resetCart: ()=> void;
};
  