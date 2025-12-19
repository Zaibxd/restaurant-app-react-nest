import React, { useEffect, useState } from "react";
import  DishCard  from './DishCard/DishCard';
import { type Dish } from "./DishDetails/DishDetails_types";


const DishesList: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([
    { id: 1, name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, tomato sauce, and basil.", price: 8.99, image: "https://source.unsplash.com/400x300/?pizza" },
    { id: 2, name: "Cheeseburger", description: "Juicy beef patty with cheddar, lettuce, tomato, and special sauce.", price: 6.5, image: "https://source.unsplash.com/400x300/?burger" },
    { id: 3, name: "Caesar Salad", description: "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing.", price: 5.99, image: "https://source.unsplash.com/400x300/?salad" },
    { id: 4, name: "Spaghetti Bolognese", description: "Classic Italian pasta with rich meat sauce and parmesan.", price: 9.5, image: "https://source.unsplash.com/400x300/?spaghetti" },
    { id: 5, name: "Chocolate Cake", description: "Decadent chocolate cake with a creamy ganache topping.", price: 4.75, image: "https://source.unsplash.com/400x300/?chocolate-cake" },
  ]);

  useEffect(() => {
    // Uncomment this code when backend API is ready
    /*
    fetch("http://localhost:3000/dishes")
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(err => console.error(err));
    */
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {dishes.map(dish => (
        <DishCard
          key={dish.id}
          id={dish.id} // Pass the id
          name={dish.name}
          description={dish.description}
          price={dish.price}
          image={dish.image}
        />
      ))}
    </div>
  );
};

export default DishesList;
