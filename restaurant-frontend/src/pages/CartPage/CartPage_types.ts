export type CheckoutForm = {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    instructions?: string;
    paymentMethod: "card" | "cod";
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
  };
  
  export const initialForm: CheckoutForm = {
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    instructions: "",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  };
  