import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 text-center">
      <p>&copy; {new Date().getFullYear()} MyRestaurant. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
