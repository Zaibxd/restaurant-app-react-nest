import React from "react";
import Navbar from "../components/Navbar";
import DishesList from "../components/DishesList";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <h1 className="text-3xl font-bold text-center mt-6">Our Dishes</h1>
        <DishesList />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
