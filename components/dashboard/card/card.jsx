import React from "react";

const Card = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col">
          <span className="text-4xl mb-4">{item.icon}</span>
          <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
        </div>
        <div className="flex items-center justify-end">
          <span className="text-5xl font-bold text-indigo-600">
            {item.number}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
