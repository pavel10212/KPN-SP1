import React from "react";

const Card = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{item.icon}</span>
        <span className="text-3xl font-bold text-indigo-600">
          {item.number}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
    </div>
  );
};

export default Card;
