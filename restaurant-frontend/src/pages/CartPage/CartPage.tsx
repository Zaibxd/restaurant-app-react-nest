import React, { useMemo, useState } from "react";
import { useCartStore } from "../../store/cart_store";
import { Link } from "react-router-dom";
import { type CheckoutForm, initialForm } from "./CartPage_types";
import { emailIsValid, phoneIsValid, cardNumberIsValid, expiryIsValid, cvvIsValid } from "../../utils/validations";
import { formatCurrency } from "../../utils/helpers";


const CheckoutPage: React.FC = () => {
  // store
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const resetCart = useCartStore((s)=> s.resetCart)

  // form
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // derived totals
  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cart]
  );
  const DELIVERY_FEE = subtotal > 0 ? 2.99 : 0; // example
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + DELIVERY_FEE + tax).toFixed(2);

  // validation
  const errors = useMemo(() => {
    const e: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!form.name.trim()) e.name = "Full name is required";
    if (!emailIsValid(form.email)) e.email = "Enter a valid email";
    if (!phoneIsValid(form.phone)) e.phone = "Enter phone (digits, country code optional)";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required";

    if (form.paymentMethod === "card") {
      if (!cardNumberIsValid(form.cardNumber || "")) e.cardNumber = "Invalid card number";
      if (!expiryIsValid(form.cardExpiry || "")) e.cardExpiry = "Expiry must be MM/YY";
      if (!cvvIsValid(form.cardCvv || "")) e.cardCvv = "Invalid CVV";
    }

    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // handlers
  const update = <K extends keyof CheckoutForm>(k: K, v: CheckoutForm[K]) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const markTouched = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const increment = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    addToCart({ ...item, quantity: 1 });
  };

  const decrement = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    addToCart({ ...item, quantity: -1 });
  };

  // place order (simulate)
  const placeOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      addressLine1: true,
      city: true,
      postalCode: true,
      cardNumber: true,
      cardExpiry: true,
      cardCvv: true,
    });

    if (!isValid || cart.length === 0) return;

    setSubmitting(true);

    // simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    // create fake order id
    const id = `ORD-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    setOrderId(id);

    // clear cart - remove each item (replace by clearCart() if available in store)
    resetCart();

    setSubmitting(false);
  };

  // If cart empty show message
  if (cart.length === 0 && !orderId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <div className="p-8 bg-white rounded shadow text-center">
          <p className="text-lg text-gray-700 mb-4">Your cart is empty.</p>
          <Link to="/" className="inline-block bg-red-600 text-white px-4 py-2 rounded">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Order placed - success screen
  if (orderId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Thank you — order received!</h2>
          <p className="text-gray-600 mb-4">Your order <span className="font-medium">{orderId}</span> is being processed.</p>
          <div className="text-left bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-2">Order summary</h3>
            <ul className="space-y-2">
              {/* items were cleared from store already — show from form snapshot? we'll display basic totals */}
              <li className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></li>
              <li className="flex justify-between"><span>Delivery</span><span>{formatCurrency(DELIVERY_FEE)}</span></li>
              <li className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></li>
              <li className="flex justify-between font-bold"><span>Total</span><span>{formatCurrency(total)}</span></li>
            </ul>
          </div>

          <Link to="/" className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // --- Main checkout form & summary UI ---
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Form (col-span 2) */}
      <form onSubmit={placeOrder} className="md:col-span-2 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        {/* Customer */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Contact & Shipping</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                onBlur={() => markTouched("name")}
                className={`mt-1 block w-full border rounded px-3 py-2 ${touched.name && errors.name ? "border-red-500" : "border-gray-200"}`}
                placeholder="Jane Doe"
              />
              {touched.name && errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => markTouched("email")}
                className={`mt-1 block w-full border rounded px-3 py-2 ${touched.email && errors.email ? "border-red-500" : "border-gray-200"}`}
                placeholder="you@example.com"
                inputMode="email"
              />
              {touched.email && errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                onBlur={() => markTouched("phone")}
                className={`mt-1 block w-full border rounded px-3 py-2 ${touched.phone && errors.phone ? "border-red-500" : "border-gray-200"}`}
                placeholder="+92300xxxxxxx"
                inputMode="tel"
              />
              {touched.phone && errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Postal code</label>
              <input
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                onBlur={() => markTouched("postalCode")}
                className={`mt-1 block w-full border rounded px-3 py-2 ${touched.postalCode && errors.postalCode ? "border-red-500" : "border-gray-200"}`}
                placeholder="10010"
                inputMode="numeric"
              />
              {touched.postalCode && errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">Address line 1</label>
            <input
              value={form.addressLine1}
              onChange={(e) => update("addressLine1", e.target.value)}
              onBlur={() => markTouched("addressLine1")}
              className={`mt-1 block w-full border rounded px-3 py-2 ${touched.addressLine1 && errors.addressLine1 ? "border-red-500" : "border-gray-200"}`}
              placeholder="123 Main St"
            />
            {touched.addressLine1 && errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">Address line 2 <span className="text-gray-400">(optional)</span></label>
            <input
              value={form.addressLine2}
              onChange={(e) => update("addressLine2", e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2 border-gray-200"
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                onBlur={() => markTouched("city")}
                className={`mt-1 block w-full border rounded px-3 py-2 ${touched.city && errors.city ? "border-red-500" : "border-gray-200"}`}
                placeholder="Karachi"
              />
              {touched.city && errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery instructions</label>
              <input
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                className="mt-1 block w-full border rounded px-3 py-2 border-gray-200"
                placeholder="Gate code, landmarks, etc."
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment</h2>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="pm"
                checked={form.paymentMethod === "card"}
                onChange={() => update("paymentMethod", "card")}
                className="mr-2"
              />
              Pay with card
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                name="pm"
                checked={form.paymentMethod === "cod"}
                onChange={() => update("paymentMethod", "cod")}
                className="mr-2"
              />
              Cash on delivery
            </label>
          </div>

          {form.paymentMethod === "card" && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Card number</label>
                <input
                  value={form.cardNumber}
                  onChange={(e) => update("cardNumber", e.target.value)}
                  onBlur={() => markTouched("cardNumber")}
                  placeholder="1234 5678 9012 3456"
                  className={`mt-1 block w-full border rounded px-3 py-2 ${touched.cardNumber ? errors.cardNumber ? "border-red-500" : "border-green-200" : "border-gray-200"}`}
                />
                {touched.cardNumber && errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                <input
                  value={form.cardExpiry}
                  onChange={(e) => update("cardExpiry", e.target.value)}
                  onBlur={() => markTouched("cardExpiry")}
                  placeholder="MM/YY"
                  className={`mt-1 block w-full border rounded px-3 py-2 ${touched.cardExpiry ? errors.cardExpiry ? "border-red-500" : "border-green-200" : "border-gray-200"}`}
                />
                {touched.cardExpiry && errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  value={form.cardCvv}
                  onChange={(e) => update("cardCvv", e.target.value)}
                  onBlur={() => markTouched("cardCvv")}
                  placeholder="123"
                  className={`mt-1 block w-full border rounded px-3 py-2 ${touched.cardCvv ? errors.cardCvv ? "border-red-500" : "border-green-200" : "border-gray-200"}`}
                />
                {touched.cardCvv && errors.cardCvv && <p className="text-xs text-red-500 mt-1">{errors.cardCvv}</p>}
              </div>
            </div>
          )}
        </section>

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={submitting || !isValid}
            className={`px-6 py-2 rounded text-white ${submitting ? "bg-gray-400" : isValid ? "bg-red-600 hover:bg-red-700" : "bg-gray-300 cursor-not-allowed"}`}
          >
            {submitting ? "Placing order..." : `Place order • ${formatCurrency(total)}`}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setTouched({});
              resetCart();
            }}
            className="px-4 py-2 rounded bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Right: Order summary */}
      <aside className="bg-white p-6 rounded shadow md:col-span-1">
        <h2 className="text-lg font-semibold mb-3">Order summary</h2>

        <div className="space-y-4">
          <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <li key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(item.price)} × {item.quantity}</p>

                  <div className="mt-2 inline-flex items-center rounded-md overflow-hidden border">
                    <button
                      onClick={() => decrement(item.id)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-50"
                      aria-label={`Decrease ${item.name}`}
                    >
                      −
                    </button>
                    <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-50"
                      aria-label={`Increase ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="ml-4 font-semibold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>{formatCurrency(DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="flex justify-between font-bold text-gray-800 mt-3 text-lg">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <p className="text-xs text-gray-400 mt-2">By placing an order you agree to our Terms & Privacy.</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;
