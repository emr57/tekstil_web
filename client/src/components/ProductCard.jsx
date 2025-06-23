import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-700 text-sm">{product.description}</p>
      <p className="text-blue-600 font-bold mt-2">{product.price}₺</p>
      
    </div>
  );
};

export default ProductCard;
