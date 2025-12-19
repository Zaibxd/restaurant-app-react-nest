import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DishesList from "./components/DishesList";
import DishDetails from "./components/DishDetails/DishDetails";
import CartPage from "./pages/CartPage/CartPage"; 
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className="text-center py-6 bg-red-100">
                  <h1 className="text-4xl font-bold text-red-600">Welcome to MyRestaurant</h1>
                  <p className="mt-2 text-gray-700">Delicious meals delivered to your doorstep</p>
                </header>
                <DishesList />
              </>
            }
          />

          <Route path="/dish/:id" element={<DishDetails />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
