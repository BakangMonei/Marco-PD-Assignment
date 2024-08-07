import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import SideBar from "../components/sidebar/SideBar";
import UserDashboard from "./UserDashboard";
import UserProfile from "./UserProfile";
import UserFavorites from "./UserFavorites";

const MainIndex = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="ml-64 p-4"> {/* Adjust margin-left to accommodate sidebar */}
                <Routes>
                    <Route path="UserDashboard" element={<UserDashboard />} />
                    <Route path="UserProfile" element={<UserProfile />} />
                    <Route path="UserFavorites" element={<UserFavorites />} />
                    <Route path="/" element={<UserDashboard />} /> {/* Default Route */}
                </Routes>
                <Outlet />
            </div>
        </div>
    );
};

export default MainIndex;
