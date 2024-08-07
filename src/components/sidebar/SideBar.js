import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, firestore } from "../../database/firebase"; // Import auth and firestore from firebase.js
import { query, where, getDocs, collection } from "firebase/firestore";

const SideBar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(
          collection(firestore, "users"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log("No matching documents found.");
          setCurrentUser(null);
        } else {
          const userData = querySnapshot.docs[0].data();
          setCurrentUser(userData);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        // Redirect to login page or homepage after logout
        window.location.href = "/LoginPage";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="h-screen fixed top-0 left-0 w-64 bg-gray-900 text-white">
      <div className="flex flex-col justify-between h-full p-4">
        <div>
          <h1 className="text-2xl font-bold mb-4">Olympics</h1>
          {currentUser && (
            <p>
              Welcome, {currentUser.firstname} {currentUser.lastname}!
            </p>
          )}
          <ul>
            <li>
              <Link
                to="/MainIndex/UserDashboard"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/MainIndex/UserProfile"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/MainIndex/UserFavorites"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Favorites
              </Link>
            </li>
          </ul>
        </div>
        <div>
          {currentUser ? (
            <button
              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="/LoginPage" className="block py-2 px-4 hover:bg-gray-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
