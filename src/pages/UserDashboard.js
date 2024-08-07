// src/components/UserDashboard.js
import React from "react";
import { sportsData } from "../database/data";
import SideBar from "../components/sidebar/SideBar";

const UserDashboard = () => {
  return (
    <div className="">
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-8">Sports Categories</h1>
        {sportsData.map((category, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
            <div className="flex overflow-x-auto space-x-4">
              {category.sports.map((sport, idx) => (
                <div
                  key={idx}
                  className="min-w-[200px] bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <img
                    src={sport.imageUrl}
                    alt={sport.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{sport.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
