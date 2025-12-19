import React from "react";
import { useNavigate } from "react-router-dom";
import { type DishCardProps } from "./DishCard_types";



const DishCard: React.FC<DishCardProps> = ({ id, name, description, price, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dish/${id}`); 
  };

  return (
    <div
      className="border rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
      onClick={handleClick}
    >
      {image && <img src={image} alt={name} className="w-full h-40 object-cover rounded" />}
      <h3 className="text-xl font-bold mt-2">{name}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
      <p className="text-red-600 font-semibold mt-2">${price.toFixed(2)}</p>
    </div>
  );
};

export default DishCard;
